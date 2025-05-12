const { DataTypes } = require('sequelize');

const { sequelize } = require('../configs/database');

const About = sequelize.define('About', {
    about_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
    vision: { type: DataTypes.TEXT },
    mission: { type: DataTypes.TEXT },
    story: { type: DataTypes.TEXT },
    banner_image: { type: DataTypes.STRING },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = About; 