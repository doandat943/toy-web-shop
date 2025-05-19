const { Op } = require("sequelize");

const Product_Variant = require('../models/product_variant');
const Product = require('../models/product');
const Colour = require('../models/colour');
const Size = require('../models/size');
const Product_Price_History = require('../models/product_price_history');
const Product_Image = require('../models/product_image');
const Category = require("../models/category");

let create = async (req, res, next) => {
    let product_name = req.body.product_name;
    if (product_name === undefined) return res.status(400).send('Trường product_name không tồn tại');
    let category_id = req.body.category_id;
    if (category_id === undefined) return res.status(400).send('Trường category_id không tồn tại');
    let price = parseInt(req.body.price);
    if (price === undefined) return res.status(400).send('Trường price không tồn tại');
    let description = req.body.description;
    if (description === undefined) return res.status(400).send('Trường description không tồn tại');

    try {
        let newProduct = await Product.create({ product_name, description, category_id });
        let newProductPriceHistory = await Product_Price_History.create({
            product_id: newProduct.product_id,
            price: price
        });
        return res.send(newProduct);
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
}

let update = async (req, res, next) => {
    let product_id = req.body.product_id;
    if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');
    let product_name = req.body.product_name;
    if (product_name === undefined) return res.status(400).send('Trường product_name không tồn tại');
    let category_id = req.body.category_id;
    if (category_id === undefined) return res.status(400).send('Trường category_id không tồn tại');
    let price = parseInt(req.body.price);
    if (price === undefined) return res.status(400).send('Trường price không tồn tại');
    let description = req.body.description;
    if (description === undefined) return res.status(400).send('Trường description không tồn tại');
    try {
        let category = await Category.findOne({ where: { category_id } });
        if (category == null) return res.status(400).send('Danh mục này không tồn tại');
        let product = await Product.findOne({ where: { product_id } });
        if (product == null) return res.status(400).send('Sản phẩm này không tồn tại');

        await Product_Price_History.create({ product_id, price })
        await product.update({ product_name, category_id, description })

        return res.send("Success")
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tạo đơn hàng vui lòng thử lại');
    }
}

let listAdminSide = async (req, res, next) => {
    try {
        console.log("Đang tải danh sách sản phẩm phía admin...");
        
        let listProductVariant = await Product_Variant.findAll({
            attributes: ['product_variant_id', 'quantity', 'state', 'created_at'],
            include: [
                {
                    model: Product, attributes: ['product_id', 'product_name'],
                    include: { model: Product_Price_History, attributes: ['price'], separate: true, order: [['created_at', 'DESC']] }
                },
                { model: Colour, attributes: ['colour_name'] },
                { model: Size, attributes: ['size_name'] },
                { model: Product_Image, attributes: ['path'] },
            ],
            order: [['created_at', 'DESC']]
        });
        
        console.log(`Tìm thấy ${listProductVariant.length} product variants`);
        
        // Kiểm tra và xử lý dữ liệu an toàn
        let safeProductVariants = [];
        
        for (const productVariant of listProductVariant) {
            try {
                // Kiểm tra các thành phần cần thiết
                if (!productVariant.Product) {
                    console.log(`Variant ${productVariant.product_variant_id} thiếu thông tin sản phẩm`);
                    continue;
                }
                
                if (!productVariant.Colour) {
                    console.log(`Variant ${productVariant.product_variant_id} thiếu thông tin màu sắc`);
                    continue;
                }
                
                if (!productVariant.Size) {
                    console.log(`Variant ${productVariant.product_variant_id} thiếu thông tin kích thước`);
                    continue;
                }
                
                // Kiểm tra danh sách giá và hình ảnh
                const priceHistories = productVariant.Product.Product_Price_Histories || [];
                if (priceHistories.length === 0) {
                    console.log(`Sản phẩm ${productVariant.Product.product_id} không có lịch sử giá`);
                }
                
                const productImages = productVariant.Product_Images || [];
                if (productImages.length === 0) {
                    console.log(`Variant ${productVariant.product_variant_id} không có hình ảnh`);
                }
                
                let newProductVariant = {
                    product_id: productVariant.Product.product_id,
                    product_variant_id: productVariant.product_variant_id,
                    product_name: productVariant.Product.product_name,
                    colour_name: productVariant.Colour.colour_name,
                    size_name: productVariant.Size.size_name,
                    product_image: productImages.length > 0 ? productImages[0].path : '/images/placeholder.jpg',
                    price: priceHistories.length > 0 ? priceHistories[0].price : 0,
                    quantity: productVariant.quantity || 0,
                    state: !!productVariant.state, // Đảm bảo giá trị boolean
                    created_at: productVariant.created_at
                };
                
                safeProductVariants.push(newProductVariant);
            } catch (variantError) {
                console.error(`Lỗi xử lý variant ${productVariant?.product_variant_id}:`, variantError);
            }
        }
        
        console.log(`Đã xử lý an toàn ${safeProductVariants.length} product variants`);
        return res.status(200).send(safeProductVariants);
    } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
        console.error("Stack trace:", err.stack);
        return res.status(500).send('Gặp lỗi khi tải danh sách sản phẩm: ' + err.message);
    }
}

let listCustomerSide = async (req, res, next) => {
    let category_id = Number(req.query.category);
    let whereClause;
    if (category_id != undefined && Number.isInteger(category_id))
        whereClause = { category_id }

    try {
        console.log("Đang tải danh sách sản phẩm cho khách hàng");
        // Lấy danh sách tất cả sản phẩm ưu tiên sản phẩm mới nhất
        let listProduct = await Product.findAll({
            attributes: ['product_id'],
            order: [['created_at', 'DESC']],
            raw: true
        });

        let listProductVariant = [];

        // Duyệt qua danh sách sản phẩm
        for (let { product_id } of listProduct) {
            // Lấy danh sách tất cả các màu của sản phẩm đó
            let listColor = await Product_Variant.findAll({
                attributes: ['colour_id'],
                where: { product_id },
                group: ['colour_id'],
                raw: true
            });
            // Duyệt qua danh sách màu
            for (let { colour_id } of listColor) {
                // Tìm tất cả biến thể sản phẩm có cùng màu với nhau
                let listProductVariantSameColour = await Product_Variant.findAll({
                    attributes: ['product_variant_id', 'colour_id'],
                    include: [
                        {
                            model: Product, attributes: ['product_id', 'product_name', 'rating', 'sold', 'feedback_quantity'],
                            include: {
                                model: Product_Price_History,
                                attributes: ['price'],
                                separate: true, order: [['created_at', 'DESC']]
                            },
                            where: whereClause
                        },
                        { model: Colour, attributes: ['colour_name'] },
                        { model: Size, attributes: ['size_name'] },
                        { model: Product_Image, attributes: ['path'] },
                    ],
                    where: {
                        [Op.and]: [
                            { colour_id },
                            { state: true },
                            { quantity: { [Op.gt]: 0 } }
                        ]
                    },
                });
                // Convert dữ liệu
                if (listProductVariantSameColour.length) {
                    let productVariant = {
                        product_id: listProductVariantSameColour[0].Product.product_id,
                        product_name: listProductVariantSameColour[0].Product.product_name,
                        rating: listProductVariantSameColour[0].Product.rating,
                        sold: listProductVariantSameColour[0].Product.sold,
                        feedback_quantity: listProductVariantSameColour[0].Product.feedback_quantity,
                        product_variant_id: listProductVariantSameColour[0].product_variant_id,
                        colour_id: listProductVariantSameColour[0].colour_id,
                        colour_name: listProductVariantSameColour[0].Colour.colour_name,
                        price: listProductVariantSameColour[0].Product.Product_Price_Histories[0].price,
                        product_image: listProductVariantSameColour[0].Product_Images[0].path,
                        sizes: []
                    };
                    // Duyệt qua danh sách biến thể sản phẩm có cùng màu để cộng dồn danh sách sizes
                    for (let { Size } of listProductVariantSameColour)
                        productVariant.sizes.push(Size.size_name);
                    listProductVariant.push(productVariant);
                }
            }
        }
        return res.send(listProductVariant);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let detailCustomerSide = async (req, res, next) => {
    let product_id = req.params.product_id;
    if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');

    try {
        let productDetail = await Product.findOne({
            attributes: ['product_id', 'product_name', 'description', 'rating', 'sold', 'feedback_quantity'],
            where: { product_id },
            raw: true
        });
        return res.send(productDetail);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let detailAdminSide = async (req, res, next) => {
    let product_id = req.params.product_id;
    if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');

    try {
        console.log(`Đang tìm sản phẩm với ID: ${product_id}`);
        
        // Kiểm tra product_id có phải là số hợp lệ
        if (isNaN(product_id)) {
            console.log("product_id không phải là số hợp lệ");
            return res.status(400).send('ID sản phẩm không hợp lệ');
        }
        
        const productDetail = await Product.findOne({
            attributes: ['product_id', 'product_name', 'category_id', 'description'],
            include: [
                { model: Category, attributes: ['category_name'] },
                { model: Product_Price_History, attributes: ['price'], separate: true, order: [['created_at', 'DESC']] },
                {
                    model: Product_Variant, attributes: ['product_variant_id', 'colour_id', 'size_id', 'quantity'],
                    include: [
                        { model: Colour, attributes: ['colour_name'] },
                        { model: Size, attributes: ['size_name'] },
                        { model: Product_Image, attributes: ['path'] }
                    ]
                }
            ],
            where: { product_id },
        });

        console.log(`Kết quả tìm kiếm sản phẩm ID ${product_id}:`, productDetail ? "Tìm thấy" : "Không tìm thấy");

        if (productDetail) {
            try {
                // Tránh lỗi nếu không có variant hoặc images
                if (!productDetail.product_variants || !Array.isArray(productDetail.product_variants)) {
                    console.log(`Sản phẩm ${product_id} không có variants`);
                    return res.status(200).send({
                        product_id: productDetail.product_id,
                        product_name: productDetail.product_name,
                        category_id: productDetail.category_id,
                        category_name: productDetail.Category ? productDetail.Category.category_name : '',
                        price: productDetail.Product_Price_Histories && productDetail.Product_Price_Histories.length > 0 ? 
                               productDetail.Product_Price_Histories[0].price : 0,
                        description: productDetail.description,
                        product_variant_list: []
                    });
                }
                
                let productVariantList = productDetail.product_variants.map((productVariant) => {
                    // Kiểm tra dữ liệu variant có đủ không
                    if (!productVariant || !productVariant.Colour || !productVariant.Size) {
                        console.log(`Variant ${productVariant?.product_variant_id} thiếu dữ liệu`);
                        return null;
                    }
                    
                    // Xử lý an toàn cho images
                    let productImages = [];
                    if (productVariant.Product_Images && Array.isArray(productVariant.Product_Images)) {
                        productImages = productVariant.Product_Images.map(image => {
                            return image ? { path: image.path } : { path: '' };
                        });
                    }
                    
                    return {
                        product_variant_id: productVariant.product_variant_id,
                        colour_id: productVariant.colour_id,
                        colour_name: productVariant.Colour.colour_name,
                        size_id: productVariant.size_id,
                        size_name: productVariant.Size.size_name,
                        quantity: productVariant.quantity || 0,
                        product_images: productImages
                    };
                }).filter(variant => variant !== null);
                
                const responseData = {
                    product_id: productDetail.product_id,
                    product_name: productDetail.product_name,
                    category_id: productDetail.category_id,
                    category_name: productDetail.Category ? productDetail.Category.category_name : '',
                    price: productDetail.Product_Price_Histories && productDetail.Product_Price_Histories.length > 0 ? 
                           productDetail.Product_Price_Histories[0].price : 0,
                    description: productDetail.description,
                    product_variant_list: productVariantList
                };
                
                return res.status(200).send(responseData);
            } catch (variantErr) {
                console.error("Lỗi xử lý variant:", variantErr);
                return res.status(500).send('Lỗi khi xử lý dữ liệu variant: ' + variantErr.message);
            }
        } else {
            console.log(`Không tìm thấy sản phẩm với ID ${product_id}`);
            return res.status(404).send('Sản phẩm này không tồn tại');
        }
    } catch (err) {
        console.error("Lỗi chi tiết:", err);
        console.error("Stack trace:", err.stack);
        return res.status(500).send('Lỗi khi tải dữ liệu: ' + err.message);
    }
}

let listColour = async (req, res, next) => {
    let product_id = req.params.product_id;
    if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');

    try {
        let listColour = await Product_Variant.findAll({
            attributes: ['colour_id'],
            include: [
                { model: Colour, attributes: ['colour_name'] },
            ],
            where: { product_id },
            group: ['colour_id'],
        });

        listColour = listColour.map((colour) => {
            let newColour = {
                colour_id: colour.colour_id,
                colour_name: colour.Colour.colour_name
            }
            return newColour;
        });

        return res.send(listColour);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let listSize = async (req, res, next) => {
    let product_id = req.params.product_id;
    if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');
    let colour_id = req.params.colour_id;
    if (colour_id === undefined) return res.status(400).send('Trường colour_id không tồn tại');

    try {
        let listSize = await Product_Variant.findAll({
            attributes: ['size_id'],
            include: [
                { model: Size, attributes: ['size_name'] },
            ],
            where: { product_id, colour_id, state: true },
        });

        listSize = listSize.map((size) => {
            let newSize = {
                size_id: size.size_id,
                size_name: size.Size.size_name
            }
            return newSize;
        });

        return res.send(listSize);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

module.exports = {
    create,
    update,
    listAdminSide,
    listCustomerSide,
    detailCustomerSide,
    detailAdminSide,
    listColour,
    listSize
};
