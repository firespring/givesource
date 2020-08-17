'use strict';

const CloudFormation = require('../aws/cloudformation');
const SecretsManager = require('../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

module.exports = function() {
	const cloudFormation = new CloudFormation();
	//return cloudFormation.describeStacks(process.env.AWS_REGION, process.env.AWS_STACK_NAME).then(function (stacks) {
	// return cloudFormation.describeStacks('us-east-1', 'JOE-TEST').then(function (stacks) {
	return cloudFormation.describeStacks('us-east-1', 'DYLAN-TEST-TWO').then(function (stacks) {
		const secretId = stacks.Stacks[0].Outputs.find(it => it.OutputKey === 'DatabaseReadwriteSecret').OutputValue;
		const secretsManager = new SecretsManager();
		//return secretsManager.getSecretValue(process.env.AWS_REGION, secretId);
		return secretsManager.getSecretValue('us-east-1', secretId);
	}).then(function (secret) {
		const readwriteSecret = JSON.parse(secret.SecretString);
		return new Sequelize({
			host: readwriteSecret.host,
			username: readwriteSecret.username,
			password: readwriteSecret.password,
			database: readwriteSecret.database,
			port: readwriteSecret.port,
			dialect: 'mysql',
			dialectModule: mysql2,
			ssl: true,
			dialectOptions: {
				ssl: 'Amazon RDS',
				connectTimeout: 60000
			}
		});
	}).then(function (sequelize) {
		return sequelize;
	});

};

