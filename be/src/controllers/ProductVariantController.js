const fs = require("fs");
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const Product = require('../models/product');
const Product_Variant = require('../models/product_variant');
const Product_Image = require('../models/product_image');
const Product_Price_History = require('../models/product_price_history');
const { uploadProductImages } = require('../midlewares/uploadImage');

// Function to download image from URL and save it
const downloadImage = async (url, imagePath, fileName) => {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        const buffer = await response.buffer();
        fs.writeFileSync(path.join(imagePath, fileName), buffer);
        
        return fileName;
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};

let create = async (req, res, next) => {
    uploadProductImages(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        
        let quantity = parseInt(req.body.quantity);
        if (quantity === undefined) return res.status(400).send('Trường quantity không tồn tại');
        let product_id = parseInt(req.body.product_id);
        if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');
        let colour_id = parseInt(req.body.colour_id);
        if (colour_id === undefined) return res.status(400).send('Trường colour_id không tồn tại');
        let size_id = parseInt(req.body.size_id);
        if (size_id === undefined) return res.status(400).send('Trường size_id không tồn tại');
        
        // Get uploaded files
        let files = req.files || [];
        
        // Get image URLs (if any)
        let imageUrls = [];
        if (req.body.imageUrls) {
            try {
                imageUrls = JSON.parse(req.body.imageUrls);
            } catch (error) {
                console.error('Error parsing imageUrls:', error);
                imageUrls = [];
            }
        }

        try {
            let data = {
                quantity,
                product_id,
                colour_id,
                size_id
            };
            let newProductVariant = await Product_Variant.create(data);
            
            // Process uploaded files
            for (let file of files) {
                let data = {
                    path: 'http://localhost:8080/static/images/' + file.filename,
                    product_variant_id: newProductVariant.product_variant_id
                }
                let newProductImage = await Product_Image.create(data);
            }
            
            // Process image URLs
            const imagePath = './src/public/images';
            for (let url of imageUrls) {
                try {
                    // Generate unique filename for URL image
                    let fileExtension = '.jpg';
                    if (url.toLowerCase().endsWith('.png')) fileExtension = '.png';
                    if (url.toLowerCase().endsWith('.gif')) fileExtension = '.gif';
                    
                    const fileName = `url_${uuidv4()}${fileExtension}`;
                    
                    // Download image from URL
                    await downloadImage(url, imagePath, fileName);
                    
                    // Create image record
                    let data = {
                        path: 'http://localhost:8080/static/images/' + fileName,
                        product_variant_id: newProductVariant.product_variant_id
                    }
                    let newProductImage = await Product_Image.create(data);
                } catch (error) {
                    console.error(`Error processing URL ${url}:`, error);
                    // Continue with other URLs if one fails
                }
            }
            
            return res.send(newProductVariant)
        } catch (err) {
            console.log(err);
            return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
        }
    })
}

let update = async (req, res, next) => {
    uploadProductImages(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        let product_variant_id = parseInt(req.body.product_variant_id);
        if (product_variant_id === undefined) return res.status(400).send('Trường product_variant_id không tồn tại');
        let quantity = parseInt(req.body.quantity);
        if (quantity === undefined) return res.status(400).send('Trường quantity không tồn tại');
        
        // Get uploaded files
        let files = req.files || [];
        
        // Get image URLs (if any)
        let imageUrls = [];
        if (req.body.imageUrls) {
            try {
                imageUrls = JSON.parse(req.body.imageUrls);
            } catch (error) {
                console.error('Error parsing imageUrls:', error);
                imageUrls = [];
            }
        }

        try {
            let productVariant = await Product_Variant.findOne({
                where: { product_variant_id },
                include: { model: Product_Image, attributes: ['image_id', 'path'] }
            });
            if (!productVariant) return res.status(400).send('Product Variant này không tồn tại');

            // Process uploaded files
            for (let file of files) {
                let path = 'http://localhost:8080/static/images/' + file.filename;
                await Product_Image.create({
                    path,
                    product_variant_id
                });
            }
            
            // Process image URLs
            const imagePath = './src/public/images';
            for (let url of imageUrls) {
                try {
                    // Generate unique filename for URL image
                    let fileExtension = '.jpg';
                    if (url.toLowerCase().endsWith('.png')) fileExtension = '.png';
                    if (url.toLowerCase().endsWith('.gif')) fileExtension = '.gif';
                    
                    const fileName = `url_${uuidv4()}${fileExtension}`;
                    
                    // Download image from URL
                    await downloadImage(url, imagePath, fileName);
                    
                    // Create image record
                    let path = 'http://localhost:8080/static/images/' + fileName;
                    await Product_Image.create({
                        path,
                        product_variant_id
                    });
                } catch (error) {
                    console.error(`Error processing URL ${url}:`, error);
                    // Continue with other URLs if one fails
                }
            }

            // Delete existing images if new ones are provided
            if ((files.length > 0 || imageUrls.length > 0) && productVariant.Product_Images.length > 0) {
                for (let { image_id, path } of productVariant.Product_Images) {
                    let directoryPath = __basedir + '\\public\\images\\';
                    let fileName = path.split('/').pop();
                    try {
                        fs.unlinkSync(directoryPath + fileName);
                    } catch (err) {
                        console.log('Could not delete file:', err);
                    }
                    await Product_Image.destroy({ where: { image_id } });
                }
            }

            await productVariant.update({ quantity });

            return res.send({ message: "Cập nhật biến thể sản phẩm thành công!" });
        } catch (err) {
            console.log(err);
            return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
        }
    })
}

let onState = async (req, res, next) => {
    try {
        let product_variant_ids = req.body.product_variant_ids;
        if (product_variant_ids === undefined) return res.status(400).send('Trường product_variant_ids không tồn tại');
        await Product_Variant.update(
            { state: true },
            { where: { product_variant_id: product_variant_ids } }
        )
        return res.send({ message: 'Mở bán biến thể sản phẩm thành công!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let offState = async (req, res, next) => {
    try {
        let product_variant_ids = req.body.product_variant_ids;
        if (product_variant_ids === undefined) return res.status(400).send('Trường product_variant_ids không tồn tại');
        Product_Variant.update(
            { state: false },
            { where: { product_variant_id: product_variant_ids } }
        )
        return res.send({ message: 'Tắt biến thể sản phẩm thành công!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let updateQuantity = async (req, res, next) => {
    try {
        let product_variant_ids = req.body.product_variant_ids;
        if (product_variant_ids === undefined) return res.status(400).send('Trường product_variant_ids không tồn tại');
        let newQuantity = req.body.quantity;
        if (newQuantity === undefined) return res.status(400).send('Trường quantity không tồn tại');

        await Product_Variant.update(
            { quantity: newQuantity },
            { where: { product_variant_id: product_variant_ids } }
        )
        return res.send({ message: 'Cập nhật tồn kho cho biến thể sản phẩm thành công!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let deleteProductVariant = async (req, res, next) => {
    let product_variant_ids = req.body.product_variant_ids;
    if (product_variant_ids === undefined) return res.status(400).send('Trường product_variant_ids không tồn tại');


    try {
        let productVariant
        for (let product_variant_id of product_variant_ids) {
            productVariant = await Product_Variant.findOne({ where: { product_variant_id } });
            if (!productVariant) return res.status(400).send('Product Variant này không tồn tại');
        }

        await Product_Variant.destroy(
            { where: { product_variant_id: product_variant_ids } }
        )

        let product_id = productVariant.product_id
        let product = await Product.findOne({ where: { product_id } })
        let count = await product.countProduct_variants()
        if (count == 0) await product.destroy()

        return res.send({ message: 'Xóa biến thể sản phẩm thành công' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let detailCustomerSide = async (req, res, next) => {
    let product_id = req.params.product_id;
    if (product_id === undefined) return res.status(400).send('Trường product_id không tồn tại');
    let colour_id = req.params.colour_id;
    if (colour_id === undefined) return res.status(400).send('Trường colour_id không tồn tại');
    let size_id = req.params.size_id;
    if (size_id === undefined) return res.status(400).send('Trường size_id không tồn tại');

    try {
        let productVariant = await Product_Variant.findOne({
            attributes: ['product_variant_id', 'quantity'],
            include: [
                {
                    model: Product, attributes: ['product_id'],
                    include: { model: Product_Price_History, attributes: ['price'], separate: true, order: [['created_at', 'DESC']] }
                },
                { model: Product_Image, attributes: ['path'] },
            ],
            where: { product_id, colour_id, size_id, state: true },
        });

        let newProductVariant = {
            product_variant_id: productVariant.product_variant_id,
            price: productVariant.Product.Product_Price_Histories[0].price,
            quantity: productVariant.quantity,
            product_images: []
        };

        for (let image of productVariant.Product_Images) {
            newProductVariant.product_images.push(image.path);
        }

        return res.send(newProductVariant);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let getDetail = async (req, res, next) => {
    let {product_id, colour_id, size_id} = req.params;
    product_id = parseInt(product_id);
    colour_id = parseInt(colour_id);
    size_id = parseInt(size_id);
    try {
        let productVariant = await Product_Variant.findOne({
            attributes: ['product_variant_id', 'quantity', 'product_id', 'colour_id', 'size_id'],
            where: {
                product_id,
                colour_id,
                size_id
            },
            include: [
                { model: Product_Image, attributes: ['path']},
                { model: Product_Price_History, attributes: ['price'], order: [['createdAt', 'DESC']], limit: 1}
            ]
        })
        if(!productVariant) return res.status(400).send("Không tìm thấy biến thể sản phẩm")

        let productVariantTemp = {
            product_variant_id: productVariant.product_variant_id,
            quantity: productVariant.quantity,
            product_id: productVariant.product_id,
            colour_id: productVariant.colour_id,
            size_id: productVariant.size_id,
            price: productVariant.Product_Price_Histories[0].price,
            product_images: productVariant.Product_Images.map((item) => item.path)
        }
        
        return res.send(productVariantTemp)
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

module.exports = {
    create,
    update,
    onState,
    offState,
    updateQuantity,
    deleteProductVariant,
    detailCustomerSide,
    getDetail
};
