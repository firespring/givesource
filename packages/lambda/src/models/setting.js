'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('Setting', {
		key: DataTypes.STRING,
		value: DataTypes.STRING
	});
};
