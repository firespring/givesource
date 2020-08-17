'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('Setting', {
		key: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		value: {
			type: DataTypes.STRING,
		}
	});
};
