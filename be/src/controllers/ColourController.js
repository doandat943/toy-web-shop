const { Op } = require('sequelize');
const Colour = require('../models/colour');
const Product_Variant = require('../models/product_variant');

let create = async (req, res, next) => {
    try {
        let colour_name = req.body.colour_name;
        if (colour_name === undefined) return res.status(400).send('Trường colour_name không tồn tại');
        let colour = await Colour.findOne({ where: { colour_name } });
        if (colour) return res.status(409).send('Tên màu đã tồn tại');
        else {
            let newColour = await Colour.create({ colour_name });
            return res.send(newColour);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let update = async (req, res, next) => {
    try {
        let colour_id = req.body.colour_id;
        if (colour_id === undefined) return res.status(400).send('Trường colour_id không tồn tại');
        let colour_name = req.body.colour_name;
        if (colour_name === undefined) return res.status(400).send('Trường colour_name không tồn tại');

        let colour = await Colour.findOne({ where: { colour_id } });
        if (!colour) return res.status(404).send('Màu không tồn tại');

        // Kiểm tra xem tên mới có bị trùng với màu khác không
        let existingColour = await Colour.findOne({ 
            where: { 
                colour_name,
                colour_id: { [Op.ne]: colour_id }
            }
        });
        if (existingColour) return res.status(409).send('Tên màu đã tồn tại');

        await colour.update({ colour_name });
        return res.send(colour);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi cập nhật màu vui lòng thử lại');
    }
}

let remove = async (req, res, next) => {
    try {
        let colour_id = req.params.colour_id;
        if (!colour_id) return res.status(400).send('Trường colour_id không tồn tại');

        let colour = await Colour.findOne({ where: { colour_id } });
        if (!colour) return res.status(404).send('Màu không tồn tại');

        // Kiểm tra xem có sản phẩm nào đang sử dụng màu này không
        let productVariants = await Product_Variant.findAll({ where: { colour_id } });
        if (productVariants.length > 0) {
            return res.status(400).send('Không thể xóa màu này vì có sản phẩm đang sử dụng');
        }

        await colour.destroy();
        return res.send('Xóa màu thành công');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi xóa màu vui lòng thử lại');
    }
}

let list = async (req, res, next) => {
    try {
        let colours = await Colour.findAll({ raw: true });
        return res.send(colours);
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

module.exports = {
    create,
    update,
    remove,
    list
};
