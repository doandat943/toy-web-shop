const fs = require("fs");
const uploadImage = require('../midlewares/uploadImage');

let uploadSingleImage = (req, res, next) => {
    // Sử dụng middleware uploadImage.uploadSingleImage
    uploadImage.uploadSingleImage(req, res, async (err) => {
        if (err) {
            console.log('Error in uploadSingleImage:', err);
            return res.status(400).send(err.message || 'Lỗi khi tải ảnh lên');
        }
        
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).send('Không có file nào được tải lên');
            }
            
            // Lấy thông tin file đầu tiên
            const file = files[0];
            
            // Phải sử dụng đường dẫn public
            const path = '/images/' + file.filename;
            
            // Trả về đường dẫn của ảnh
            return res.status(200).json({
                success: true,
                path: path,
                filename: file.filename
            });
        } catch (err) {
            console.log('Exception in uploadSingleImage:', err);
            return res.status(500).send('Gặp lỗi khi tải ảnh lên, vui lòng thử lại');
        }
    });
};

module.exports = {
    uploadSingleImage
}; 