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

const fs = require('fs');
const path = require('path');
const logger = require('./../../helpers/log');
const response = require('cfn-response');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');
const SecretsManager = require('./../../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

exports.handle = function (event, context, callback) {
	logger.log('migrateDatabase event: %j', event);

	const secretsManager = new SecretsManager();
	const request = new Request(event, context);
	const s3 = new S3();
	const localPath = '/tmp';

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	request.validate().then(function () {
		fs.rmdirSync(path.join(localPath, process.env.MIGRATIONS_LOCATION), {recursive: true});
		return s3.listObjects(process.env.AWS_REGION, process.env.MIGRATIONS_BUCKET, process.env.MIGRATIONS_LOCATION).then(function (objects) {
			return Promise.all(objects.map(function (obj) {
				return s3.downloadObject(process.env.AWS_REGION, process.env.MIGRATIONS_BUCKET, obj.Key, localPath);
			}));
		});
	}).then(function () {
		return secretsManager.getSecretValue(process.env.AWS_REGION, process.env.MAINTENANCE_DATABASE_SECRET_ID);
	}).then(function (secret) {
		const dbHost = process.env.DATABASE_HOST;
		const dbName = process.env.DATABASE_NAME;
		const maintenanceSecret = JSON.parse(secret.SecretString);
		const sequelize = new Sequelize({
			host: dbHost,
			username: maintenanceSecret.username,
			password: maintenanceSecret.password,
			database: dbName,
			dialect: 'mysql',
			dialectModule: mysql2,
			port: 3306,
			ssl: true,
			dialectOptions: {
				ssl: 'Amazon RDS'
			}
		});

		const umzug = new Umzug({
			migrations: {
				path: path.join(localPath, process.env.MIGRATIONS_LOCATION),
				params: [
					sequelize.getQueryInterface(),
					Sequelize
				],
				customResolver: function (filePath) {
					return __non_webpack_require__(filePath);
				},
			},
			storage: 'sequelize',
			storageOptions: {
				sequelize: sequelize
			}
		})

		return umzug.up();
	}).then(function (migrations) {
		logger.log("Ran migrations:" + migrations.map(it => { return it['file'] }));
		response.send(event, context, response.SUCCESS, {});
		callback();
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED, {});
		callback(err);
	});
};
