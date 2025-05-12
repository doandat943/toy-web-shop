const WebsiteInfo = require('../models/website_info');

let getWebsiteInfo = async (req, res, next) => {
    try {
        let websiteInfo = await WebsiteInfo.findOne({ order: [['created_at', 'DESC']] });
        if (!websiteInfo) {
            // Tạo thông tin mặc định nếu chưa có
            websiteInfo = await WebsiteInfo.create({});
        }
        return res.send(websiteInfo);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải thông tin website');
    }
};

let updateWebsiteInfo = async (req, res, next) => {
    try {
        let { 
            website_info_id, 
            website_name, 
            website_logo, 
            company_name, 
            company_info, 
            hotline, 
            hotline_hours,
            email,
            facebook_link,
            zalo_link,
            tiktok_link,
            instagram_link,
            youtube_link
        } = req.body;
        
        if (!website_info_id) {
            // Tạo mới nếu không có ID
            let newWebsiteInfo = await WebsiteInfo.create({
                website_name, 
                website_logo, 
                company_name, 
                company_info, 
                hotline, 
                hotline_hours,
                email,
                facebook_link,
                zalo_link,
                tiktok_link,
                instagram_link,
                youtube_link
            });
            return res.send(newWebsiteInfo);
        } else {
            // Cập nhật nếu có ID
            let websiteInfo = await WebsiteInfo.findOne({ where: { website_info_id } });
            if (!websiteInfo) {
                return res.status(404).send('Không tìm thấy thông tin website');
            }
            
            await websiteInfo.update({ 
                website_name, 
                website_logo, 
                company_name, 
                company_info, 
                hotline, 
                hotline_hours,
                email,
                facebook_link,
                zalo_link,
                tiktok_link,
                instagram_link,
                youtube_link
            });
            return res.send(websiteInfo);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi cập nhật thông tin website');
    }
};

module.exports = {
    getWebsiteInfo,
    updateWebsiteInfo
}; 