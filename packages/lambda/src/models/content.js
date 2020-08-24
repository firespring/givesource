'use strict';

const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('Content', {
		key: {
			type: DataTypes.STRING,
			allowNull: false
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		sortOrder: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		}
	});
};
