'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const mysql2 = require('mysql2');
const setting = require('./setting');

const sequelize = new Sequelize({
	host: 'dylan-test-two-auroradbstack-19x03f0xu-rdscluster-1bsdxanbndw2a.cluster-cdppswj4bvwh.us-east-1.rds.amazonaws.com',
	username: 'readonly',
	password: 'pL0CM[>)mrTjOr((R#]K>f+:p6m,Ha{`',
	database: 'givesource',
	port: 3306,
	dialect: 'mysql',
	dialectModule: mysql2,
	ssl: true,
	dialectOptions: {
		ssl: 'Amazon RDS'
	}
});

const models = [setting];

models.forEach(function (object) {
	const model = require('./setting')(sequelize, Sequelize.DataTypes);
	console.log('index model!'); /*DM: Debug */
	console.log(model); /*DM: Debug */
	db['Setting'] = model;
});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});
console.log('db equals: ', db); /*DM: Debug */

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log(db); /*DM: Debug */

module.exports = db;
