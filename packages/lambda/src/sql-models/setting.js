'use strict';

const { sequelize, Sequelize } = require('./connect')
//console.log("IN SETTINGS, SEQUELIZE IS ");
//console.log(sequelize);

const Setting = sequelize.define('Setting', {
  key: Sequelize.DataTypes.STRING,
  value: Sequelize.DataTypes.STRING
});

module.exports = Setting;
