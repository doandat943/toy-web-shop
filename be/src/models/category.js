const { DataTypes } = require('sequelize');

const { sequelize } = require('../configs/database');

const Category = sequelize.define('Category', {
    category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category_name: { type: DataTypes.STRING, allowNull: false },
    category_slug: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: true },
    age_range: { type: DataTypes.STRING, allowNull: true },
    background_color: { type: DataTypes.STRING, allowNull: true },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    state: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
    tableName: 'category',
    timestamps: false
})

Category.associate = (models) => {
    Category.hasMany(models.Product, {
        foreignKey: 'category_id'
    });
    Category.hasMany(models.Category, {
        foreignKey: 'parent_id',
        as: 'children'
    });
    Category.belongsTo(models.Category, {
        foreignKey: 'parent_id',
        as: 'parent'
    });
};

module.exports = Category;
