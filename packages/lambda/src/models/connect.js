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

'use strict';

const SecretsManager = require('../aws/secretsManager');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

module.exports = function() {
	const readwriteSecretId = process.env.AWS_STACK_NAME + "-ReadwriteUserSecret";
	const secretsManager = new SecretsManager();
	secretsManager.getSecretValue(process.env.AWS_REGION, readwriteSecretId).then(function (secret) {
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
	});
};
