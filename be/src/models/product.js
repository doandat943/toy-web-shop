const { DataTypes } = require('sequelize');

const { sequelize } = require('../configs/database');
const Category = require('./category');

const Product = sequelize.define('Product', {
	product_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	product_name: DataTypes.STRING,
	description: DataTypes.TEXT,
	rating: { type: DataTypes.FLOAT, defaultValue: 0 },
	sold: { type: DataTypes.INTEGER, defaultValue: 0 },
	feedback_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
	// Thêm các trường cho đồ chơi trẻ em
	recommended_age_min: { type: DataTypes.INTEGER, defaultValue: 0, comment: 'Độ tuổi tối thiểu (tháng)' },
	recommended_age_max: { type: DataTypes.INTEGER, comment: 'Độ tuổi tối đa (tháng), NULL nếu không có giới hạn' },
	safety_certifications: { type: DataTypes.STRING, comment: 'Các chứng nhận an toàn, phân cách bởi dấu phẩy' },
	toy_type: { type: DataTypes.STRING, comment: 'Loại đồ chơi (educational, outdoor, building, etc.)' },
	is_battery_required: { type: DataTypes.BOOLEAN, defaultValue: false },
	battery_type: { type: DataTypes.STRING, comment: 'Loại pin nếu cần' },
	material: { type: DataTypes.STRING, comment: 'Vật liệu chính của đồ chơi' },
	educational_value: { type: DataTypes.TEXT, comment: 'Giá trị giáo dục của đồ chơi' },
	has_video: { type: DataTypes.BOOLEAN, defaultValue: false, comment: 'Sản phẩm có video demo hay không' },
	video_url: { type: DataTypes.STRING, comment: 'URL video demo sản phẩm' },
	gift_occasion: { type: DataTypes.STRING, comment: 'Dịp lễ phù hợp làm quà (birthday, christmas, etc.)' },
}, {
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: false,
	paranoid: true,
	deletedAt: 'deleted_at'
})

Category.hasMany(Product, {
	foreignKey: { name: 'category_id', type: DataTypes.INTEGER }
});
Product.belongsTo(Category, {
	foreignKey: { name: 'category_id', type: DataTypes.INTEGER }
});

module.exports = Product;
