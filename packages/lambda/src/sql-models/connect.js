'use strict';

const fs = require('fs');
const path = require('path');
const CloudFormation = require('./../aws/cloudformation');
const SecretsManager = require('./../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

console.log("IN CONNECT");

function init() {
	try {
		console.log("Getting stack " + process.env.AWS_STACK_NAME + " in region " + process.env.AWS_REGION);

		const cloudFormation = new CloudFormation();
		return cloudFormation.describeStacks(process.env.AWS_REGION, process.env.AWS_STACK_NAME).then(function (stacks) {
			const stack = stacks.Stacks[0];
			const secretId = stack.Outputs.find(it => it.OutputKey === 'DatabaseReadonlySecret').OutputValue;
			console.log("SECRET ID IS " + secretId);
			const secretsManager = new SecretsManager();
			return secretsManager.getSecretValue(process.env.AWS_REGION, secretId);
		}).then(function (secret) {
			console.log("SECRET IS " + secret);
			console.log(secret);
			//const readonlySecret = JSON.parse(secret.SecretString);
			return new Sequelize({
				//host: readonlySecret.host,
				//username: readonlySecret.username,
				//password: readonlySecret.password,
				//database: readonlySecret.database,
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
		});
	}	catch (error) {
		console.log("ERROR");
		console.log(error);
		throw error;
	}
}

console.log("INIT IS");
console.log(init());

//const sequelize = init();
const sequelize = new Sequelize({
	//host: readonlySecret.host,
	//username: readonlySecret.username,
	//password: readonlySecret.password,
	//database: readonlySecret.database,
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
//console.log("FROM INIT, SEQUELIZE IS ");
//console.log(sequelize);
module.exports = {"sequelize": sequelize, "Sequelize": Sequelize};
