const Category = require('../models/category');
const Product = require('../models/product');
const Product_Variant = require('../models/product_variant');
const Product_Image = require('../models/product_image');
const Product_Price_History = require('../models/product_price_history');
const { Op } = require('sequelize');

let createLevel1 = async (req, res, next) => {
    try {
        let title = req.body.title;
        if (title === undefined) return res.status(400).send('Trường title không tồn tại');
        let category = await Category.findOne({ where: { title } });
        if (category) return res.status(409).send('Tên danh mục đã tồn tại');
        else {
            let newCategory = await Category.create({ title });
            return res.send(newCategory);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let createLevel2 = async (req, res, next) => {
    try {
        let title = req.body.title;
        if (title === undefined) return res.status(400).send('Trường title không tồn tại');
        let parent_id = req.body.parent_id;
        if (parent_id === undefined) return res.status(400).send('Trường parent_id không tồn tại');
        let parentCategory = await Category.findOne({ where: { category_id: parent_id } });
        if (!parentCategory) return res.status(400).send('parent_id đã nhập không tồn tại');
        let category = await Category.findOne({ where: { title: title, level: 2 } });
        if (category) return res.status(409).send('Tên danh mục đã tồn tại');
        else {
            let newCategory = await Category.create({ title, level: 2, parent_id });
            return res.send(newCategory);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let update = async (req, res, next) => {
    try {
        let category_id = req.body.category_id;
        if (category_id === undefined) return res.status(400).send('Trường category_id không tồn tại');
        let title = req.body.title;
        if (title === undefined) return res.status(400).send('Trường title không tồn tại');
        let description = req.body.description;
        let image = req.body.image;

        let category = await Category.findOne({ where: { category_id } });
        if (!category) return res.status(404).send('Danh mục không tồn tại');

        // Kiểm tra xem tên mới có bị trùng với danh mục khác không
        let existingCategory = await Category.findOne({ 
            where: { 
                title,
                category_id: { [Op.ne]: category_id }
            }
        });
        if (existingCategory) return res.status(409).send('Tên danh mục đã tồn tại');

        await category.update({ title, description, image });
        return res.send(category);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi cập nhật danh mục vui lòng thử lại');
    }
}

let remove = async (req, res, next) => {
    try {
        let category_id = req.params.category_id;
        if (!category_id) return res.status(400).send('Trường category_id không tồn tại');

        let category = await Category.findOne({ where: { category_id } });
        if (!category) return res.status(404).send('Danh mục không tồn tại');

        // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
        let products = await Product.findAll({ where: { category_id } });
        if (products.length > 0) {
            return res.status(400).send('Không thể xóa danh mục này vì có sản phẩm đang sử dụng');
        }

        // Kiểm tra xem có danh mục con không
        let childCategories = await Category.findAll({ where: { parent_id: category_id } });
        if (childCategories.length > 0) {
            return res.status(400).send('Không thể xóa danh mục này vì có danh mục con');
        }

        await category.destroy();
        return res.send('Xóa danh mục thành công');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi xóa danh mục vui lòng thử lại');
    }
}

let nestList = async (req, res, next) => {
    try {
        let listCategoryLevel1 = await Category.findAll({
            where: { parent_id: null },
            attributes: ['category_id', 'title'],
            raw: true
        });

        let listCategory = [];
        for (let { category_id, title } of listCategoryLevel1) {
            let listCategoryLevel2 = await Category.findAll({
                where: { parent_id: category_id },
                attributes: ['category_id', 'title'],
                raw: true
            });
            let category = { category_id, title, children: listCategoryLevel2 };
            listCategory.push(category);
        }

        res.send(listCategory);
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let list = async (req, res, next) => {
    try {
        let categoryList = await Category.findAll({ raw: true, order: [['level', 'ASC'],] })
        categoryList = await Promise.all(categoryList.map(async (category) => {
            let parent
            if (category.parent_id != null) {
                parent = await Category.findOne({ attributes: ['title'], where: { category_id: category.parent_id } })
                return {
                    category_id: category.category_id,
                    title: category.title,
                    level: category.level,
                    parent: parent.title
                }
            }
            else {
                return {
                    category_id: category.category_id,
                    title: category.title,
                    level: category.level,
                    parent: null
                }
            }
        }))
        return res.send(categoryList)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let listLevel1 = async (req, res, next) => {
    try {
        let categories = await Category.findAll({
            where: { parent_id: null },
            attributes: ['category_id', 'title'],
            raw: true
        });
        return res.send(categories);
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let getNestList = async (req, res, next) => {
    try {
        let categories = await Category.findAll({
            where: { state: true },
            include: { model: Category, as: 'children', where: { state: true }, required: false }
        });
        let result = [];
        for (let category of categories) {
            if (category.parent_id === null) {
                let children = [];
                for (let child of categories) {
                    if (child.parent_id === category.category_id) {
                        children.push({
                            category_id: child.category_id,
                            category_name: child.category_name,
                            category_slug: child.category_slug,
                            icon: child.icon || null,
                            age_range: child.age_range || null,
                            background_color: child.background_color || null
                        });
                    }
                }
                result.push({
                    category_id: category.category_id,
                    category_name: category.category_name,
                    category_slug: category.category_slug,
                    icon: category.icon || null,
                    age_range: category.age_range || null,
                    background_color: category.background_color || null,
                    children: children
                });
            }
        }
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let listAll = async (req, res, next) => {
    try {
        let categories = await Category.findAll({
            where: { state: true },
            attributes: [
                'category_id',
                'category_name',
                'category_slug',
                'icon',
                'age_range',
                'background_color',
                'parent_id',
                'order',
                'state'
            ]
        });
        return res.send(categories);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let create = async (req, res, next) => {
    try {
        let category_name = req.body.category_name;
        if (category_name === undefined) return res.status(400).send('Trường category_name không tồn tại');
        let category_slug = req.body.category_slug;
        if (category_slug === undefined) return res.status(400).send('Trường category_slug không tồn tại');
        let icon = req.body.icon;
        let age_range = req.body.age_range;
        let background_color = req.body.background_color;
        let parent_id = req.body.parent_id;
        
        let category = await Category.create({
            category_name,
            category_slug,
            icon,
            age_range,
            background_color,
            parent_id
        });
        return res.send(category);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

module.exports = {
    createLevel1,
    createLevel2,
    update,
    remove,
    nestList,
    list,
    listLevel1,
    getNestList,
    listAll,
    create
};
