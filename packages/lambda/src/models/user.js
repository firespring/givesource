'use strict';

const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('User', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		nonprofitId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		cognitoUsername: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cognitoUuid: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
	});
};