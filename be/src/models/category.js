const { DataTypes } = require('sequelize');

const { sequelize } = require('../configs/database');

const Category = sequelize.define('Category', {
    category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: DataTypes.STRING,
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    parent_id: { type: DataTypes.INTEGER, defaultValue: null },
    age_group: { type: DataTypes.STRING, comment: 'Nhóm tuổi (infant, toddler, preschool, school-age)' },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false, comment: 'Danh mục nổi bật hiển thị ở trang chủ' },
    icon_url: { type: DataTypes.STRING, comment: 'URL icon hiển thị cho danh mục' },
    banner_url: { type: DataTypes.STRING, comment: 'URL banner hiển thị cho danh mục' },
    description: { type: DataTypes.TEXT, comment: 'Mô tả danh mục' },
}, {
    timestamps : false
})

module.exports = Category;
