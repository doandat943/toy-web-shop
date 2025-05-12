const About = require('../models/about');

let getAboutInfo = async (req, res, next) => {
    try {
        let aboutInfo = await About.findOne({ order: [['created_at', 'DESC']] });
        if (!aboutInfo) {
            // Nếu chưa có thông tin, tạo thông tin mặc định
            aboutInfo = await About.create({
                title: 'Về chúng tôi',
                content: 'Chúng tôi là cửa hàng đồ chơi hàng đầu với nhiều sản phẩm chất lượng.',
                vision: 'Trở thành cửa hàng đồ chơi số 1 Việt Nam.',
                mission: 'Mang lại niềm vui cho trẻ em và sự hài lòng cho phụ huynh.',
                story: 'Cửa hàng được thành lập vào năm 2020 với mong muốn cung cấp đồ chơi an toàn, chất lượng cho trẻ em.',
                banner_image: '/images/about-banner.jpg'
            });
        }
        return res.send(aboutInfo);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải thông tin giới thiệu');
    }
};

let updateAboutInfo = async (req, res, next) => {
    try {
        let { about_id, title, content, vision, mission, story, banner_image } = req.body;
        
        if (!about_id) {
            // Nếu không có about_id, tạo mới
            let newAboutInfo = await About.create({
                title, content, vision, mission, story, banner_image
            });
            return res.send(newAboutInfo);
        } else {
            // Nếu có about_id, cập nhật
            let aboutInfo = await About.findOne({ where: { about_id } });
            if (!aboutInfo) {
                return res.status(404).send('Không tìm thấy thông tin giới thiệu');
            }
            
            await aboutInfo.update({ title, content, vision, mission, story, banner_image });
            return res.send(aboutInfo);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi cập nhật thông tin giới thiệu');
    }
};

module.exports = {
    getAboutInfo,
    updateAboutInfo
}; 