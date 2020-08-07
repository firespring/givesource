'use strict';

const fs = require('fs');
const path = require('path');
const SecretsManager = require('./../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};
console.log("IN INDEX.js");

const secretsManager = new SecretsManager();
//return secretsManager.getSecretValue(process.env.AWS_REGION, process.env.MAINTENANCE_DATABASE_SECRET_ID);
//console.log(secret);
//const readonlySecret = JSON.parse(secret.SecretString);
const sequelize = new Sequelize({
	//host: readonlySecret.host,
	//username: readonlySecret.username,
	//password: readonlySecret.password,
	//port: readonlySecret.port,
	host: 'joe-test-auroradbstack-z5gweu0i7813-rdscluster-odnvjq2syzbe.cluster-cdppswj4bvwh.us-east-1.rds.amazonaws.com',
	username: 'readonly',
	password: 'MXq5Ie9Rndsv5nc5cKIFlovt0GVm1k1G',
	database: 'givesource',
	port: 3306,
	dialect: 'mysql',
	dialectModule: mysql2,
	ssl: true,
	dialectOptions: {
		ssl: 'Amazon RDS'
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
