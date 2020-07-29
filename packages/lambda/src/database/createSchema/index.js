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

const response = require('cfn-response');
const Request = require('./../../aws/request');
const SecretsManager = require('./../../aws/secretsManager');
const Sequelize = require('sequelize');
const mysql2 = require('mysql2');

exports.handle = function (event, context, callback) {
	console.log(JSON.stringify(event));
	const secretsManager = new SecretsManager();
	const request = new Request(event, context);

	// if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
	// 	response.send(event, context, response.SUCCESS, {});
	// 	return;
	// }

	request.validate().then(function () {
		return secretsManager.getSecretValue(process.env.AWS_REGION, process.env.SECRETS_MANAGER_SECRET_ID);
	}).then(function (res) {
		console.log('right above sequelize'); /*DM: Debug */
		const sequelize = new Sequelize('givesource', process.env.DATABASE_USER, JSON.parse(res.SecretString).password, {
			host: process.env.AURORA_DB_HOST,
			dialect: 'mysql',
			dialectModule: mysql2,
			port: 3306
		});
		return sequelize.authenticate();
	}).then(function (res) {
		console.log(res); /*DM: Debug */
		response.send(event, context, response.SUCCESS, {});
		callback();
	}).catch(function (err) {
		console.log(err);
		response.send(event, context, response.FAILED, {});
		callback(err);
	});
};
