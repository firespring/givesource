'use strict';

const { sequelize, Sequelize } = require('./index')

const Setting = sequelize.define('Setting', {
  key: Sequelize.DataTypes.STRING,
  value: Sequelize.DataTypes.STRING
});

//class Setting extends Sequelize.Model {}
//
//Setting.init({
//  key: Sequelize.DataTypes.STRING,
//  value: Sequelize.DataTypes.STRING
//}, {
//  sequelize,
//  modelName: 'Setting'
//});

module.exports = Setting;
