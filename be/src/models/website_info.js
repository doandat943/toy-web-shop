const { DataTypes } = require('sequelize');

const { sequelize } = require('../configs/database');

const WebsiteInfo = sequelize.define('Website_Info', {
    website_info_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    website_name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'elevenT' },
    website_logo: { type: DataTypes.STRING, defaultValue: '/img/logo.png' },
    company_name: { type: DataTypes.STRING, defaultValue: 'CÔNG TY TNHH NASTECH ASIA' },
    company_info: { type: DataTypes.TEXT, defaultValue: 'Mã số doanh nghiệp: 0108116083. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Cần Thơ cấp lần đầu ngày 21/03/2017.' },
    hotline: { type: DataTypes.STRING, defaultValue: '19003.175737 - 026.747.2737' },
    hotline_hours: { type: DataTypes.STRING, defaultValue: '(8:30-22:00)' },
    email: { type: DataTypes.STRING, defaultValue: 'elevent@elevent.cool' },
    facebook_link: { type: DataTypes.STRING, defaultValue: '#' },
    zalo_link: { type: DataTypes.STRING, defaultValue: '#' },
    tiktok_link: { type: DataTypes.STRING, defaultValue: '#' },
    instagram_link: { type: DataTypes.STRING, defaultValue: '#' },
    youtube_link: { type: DataTypes.STRING, defaultValue: '#' }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = WebsiteInfo; 