'use strict';

const { sequelize, Sequelize } = require('./connect');

const Setting = sequelize.define('Setting', {
  key: Sequelize.DataTypes.STRING,
  value: Sequelize.DataTypes.STRING
});

console.log(Setting === sequelize.models.Setting);
