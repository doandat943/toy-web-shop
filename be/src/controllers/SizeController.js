const { Op } = require('sequelize');
const Size = require('../models/size');
const Product_Variant = require('../models/product_variant');

let create = async (req, res, next) => {
    try {
        let size_name = req.body.size_name;
        if (size_name === undefined) return res.status(400).send('Trường size_name không tồn tại');
        let size = await Size.findOne({ where: { size_name } });
        if (size) return res.status(409).send('Tên kích thước đã tồn tại');
        else {
            let newSize = await Size.create({ size_name });
            return res.send(newSize);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}

let update = async (req, res, next) => {
    try {
        let size_id = req.body.size_id;
        if (size_id === undefined) return res.status(400).send('Trường size_id không tồn tại');
        let size_name = req.body.size_name;
        if (size_name === undefined) return res.status(400).send('Trường size_name không tồn tại');

        let size = await Size.findOne({ where: { size_id } });
        if (!size) return res.status(404).send('Kích thước không tồn tại');

        // Kiểm tra xem tên mới có bị trùng với kích thước khác không
        let existingSize = await Size.findOne({ 
            where: { 
                size_name,
                size_id: { [Op.ne]: size_id }
            }
        });
        if (existingSize) return res.status(409).send('Tên kích thước đã tồn tại');

        await size.update({ size_name });
        return res.send(size);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi cập nhật kích thước vui lòng thử lại');
    }
}

let remove = async (req, res, next) => {
    try {
        let size_id = req.params.size_id;
        if (!size_id) return res.status(400).send('Trường size_id không tồn tại');

        let size = await Size.findOne({ where: { size_id } });
        if (!size) return res.status(404).send('Kích thước không tồn tại');

        // Kiểm tra xem có sản phẩm nào đang sử dụng kích thước này không
        let productVariants = await Product_Variant.findAll({ where: { size_id } });
        if (productVariants.length > 0) {
            return res.status(400).send('Không thể xóa kích thước này vì có sản phẩm đang sử dụng');
        }

        await size.destroy();
        return res.send('Xóa kích thước thành công');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi xóa kích thước vui lòng thử lại');
    }
}

let list = async (req, res, next) => {
    try {
        let sizes = await Size.findAll({ raw: true });
        return res.send(sizes);
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
