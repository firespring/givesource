/*
 * Copyright 2019 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const logger = require('./../../helpers/log');
const response = require('cfn-response');
const Request = require('./../../aws/request');
const SecretsManager = require('./../../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

exports.handle = function (event, context, callback) {
	logger.log('bootstrapDatabase event: %j', event);

	const request = new Request(event, context);
	const secretsManager = new SecretsManager();

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	let sequelize;
	request.validate().then(function () {
		return Promise.all([
			secretsManager.getSecretValue(process.env.AWS_REGION, process.env.ADMIN_DATABASE_SECRET_ID),
			secretsManager.getSecretValue(process.env.AWS_REGION, process.env.MAINTENANCE_DATABASE_SECRET_ID),
			secretsManager.getSecretValue(process.env.AWS_REGION, process.env.READWRITE_DATABASE_SECRET_ID),
			secretsManager.getSecretValue(process.env.AWS_REGION, process.env.READONLY_DATABASE_SECRET_ID)
		]);
	}).then(function (secrets) {
		const dbHost = process.env.DATABASE_HOST;
		const dbName = process.env.DATABASE_NAME;
		const adminSecret = JSON.parse(secrets.find(it => it['Name'] === process.env.ADMIN_DATABASE_SECRET_ID).SecretString);
		const maintenanceSecret = JSON.parse(secrets.find(it => it['Name'] === process.env.MAINTENANCE_DATABASE_SECRET_ID).SecretString);
		const readwriteSecret = JSON.parse(secrets.find(it => it['Name'] === process.env.READWRITE_DATABASE_SECRET_ID).SecretString);
		const readonlySecret = JSON.parse(secrets.find(it => it['Name'] === process.env.READONLY_DATABASE_SECRET_ID).SecretString);

		sequelize = new Sequelize({
			host: adminSecret.host,
			username: adminSecret.username,
			password: adminSecret.password,
			port: adminSecret.port,
			dialect: 'mysql',
			dialectModule: mysql2,
			logging: false, // don't log the sql so we don't log the passwords
			ssl: true,
			dialectOptions: {
				ssl: 'Amazon RDS',
				multipleStatements: true
			}
		});

		// TODO: Add REQUIRE SSL to the grants
		return sequelize.query(
			'CREATE DATABASE IF NOT EXISTS `' + dbName + '` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci; ' +
			'CREATE USER IF NOT EXISTS "' + maintenanceSecret.username + '"@"%" IDENTIFIED BY "' + maintenanceSecret.password + '"; ' +
			'GRANT ALL PRIVILEGES ON `' + dbName+ '`.* TO "' + maintenanceSecret.username + '"@"%"; ' +
			'CREATE USER IF NOT EXISTS "' + readwriteSecret.username + '"@"%" IDENTIFIED BY "' + readwriteSecret.password + '"; ' +
			'GRANT SELECT, INSERT, UPDATE, DELETE, CREATE TEMPORARY TABLES, EXECUTE ON `' + dbName+ '`.* TO "' + readwriteSecret.username + '"@"%"; ' +
			'CREATE USER IF NOT EXISTS "' + readonlySecret.username + '"@"%" IDENTIFIED BY "' + readonlySecret.password + '"; ' +
			'GRANT SELECT ON `' + dbName+ '`.* TO "' + readonlySecret.username + '"@"%";'
		);
	}).then(function () {
		response.send(event, context, response.SUCCESS);
		callback();
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
		callback(err);
	}).finally(function() {
		if (sequelize) {
			sequelize.close();
		}
	});
};
