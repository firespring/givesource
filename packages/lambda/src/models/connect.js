'use strict';

const fs = require('fs');
const path = require('path');
const CloudFormation = require('./../aws/cloudformation');
const SecretsManager = require('./../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

console.log("IN CONNECT");
function init() {
	console.log("Getting stack " + process.env.AWS_STACK_NAME + " in region " + process.env.AWS_REGION);

	return new Sequelize({
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
}

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

module.exports = {"sequelize": sequelize, "Sequelize": Sequelize};
