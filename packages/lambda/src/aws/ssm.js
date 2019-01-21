/*
 * Copyright 2018 Firespring, Inc.
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

const AWS = require('aws-sdk');

/**
 * SSM Constructor
 *
 * @constructor
 */
function SSM() {
}

/**
 * Get a parameter from AWS SSM parameter store
 *
 * @param {String} region
 * @param {String} name
 * @param {bool} [decryption]
 * @return {Promise}
 */
SSM.prototype.getParameter = function (region, name, decryption) {
	const awsSSM = new AWS.SSM({region: region});
	return new Promise(function (resolve, reject) {
		decryption = decryption || false;
		const params = {
			Name: name,
			WithDecryption: decryption
		};
		awsSSM.getParameter(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Update a parameter in AWS SSM parameter store
 *
 * @param {String} region
 * @param {String} name
 * @param {String} value
 * @param {String} [type]
 * @param {String} [keyId]
 * @param {bool} [overwrite]
 * @return {Promise}
 */

SSM.prototype.putParameter = function (region, name, value, type, keyId, overwrite) {
	const awsSSM = new AWS.SSM({region: region});
	return new Promise(function (resolve, reject) {
		if (!type) {
			type = keyId ? 'SecureString' : 'String';
		}
		overwrite = overwrite || true;
		const params = {
			Name: name,
			Type: type,
			Value: value,
			Overwrite: overwrite
		};
		if (keyId) {
			params['KeyId'] = keyId;
		}
		awsSSM.putParameter(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Delete a parameter in AWS SSM parameter store
 *
 * @param {String} region
 * @param {String} name
 * @return {Promise}
 */
SSM.prototype.deleteParameter = (region, name) => {
	const awsSSM = new AWS.SSM({region: region});
	return new Promise((resolve, reject) => {
		awsSSM.deleteParameter({Name: name}, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports = SSM;