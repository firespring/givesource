/*
 * Copyright (C) 2018  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
		type = type || keyId ? 'SecureString' : 'String';
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

module.exports = SSM;