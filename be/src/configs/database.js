const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD,
	{ 
		host: process.env.DATABASE_HOST, 
		port: process.env.DATABASE_PORT || 3306,
		dialect: 'mysql', 
		logging: false 
	}
);

module.exports = {
	sequelize,
	connect: async () => {
		try {
			const connection = await mysql.createConnection({
				host: process.env.DATABASE_HOST,
				port: process.env.DATABASE_PORT || 3306,
				user: process.env.DATABASE_USERNAME,
				password: process.env.DATABASE_PASSWORD,
			});

			await connection.query(
				'CREATE DATABASE IF NOT EXISTS `toy-web-shop`'
			);

			await connection.end();

			await sequelize.authenticate();
			console.log('Connection has been established successfully.');
			await sequelize.sync();
		} catch (error) {
			console.error('Unable to connect to the database:', error);
		}
	}
}