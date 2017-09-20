/*
 * Copyright (C) 2017  Firespring
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
const env = require('../helpers/env');

/**
 * ApiGateway constructor
 *
 * @constructor
 */
function ApiGateway() {
	this.apiGateway = new AWS.APIGateway({region: env.AWS_REGION});
}

/**
 * Deploy an AWS API Gateway
 *
 * @param {String} restApiId
 * @param {String} stageName
 * @return {Promise}
 */
ApiGateway.prototype.deploy = function (restApiId, stageName) {
	const gateway = this;
	return new Promise(function (resolve, reject) {
		const params = {
			RestApiId: restApiId,
			StageName: stageName
		};
		gateway.apiGateway.createDeployment(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
};

/**
 * Get the api keys of an AWS API Gateway
 *
 * @param {String} nameQuery
 * @return {Promise}
 */
ApiGateway.prototype.getApiKeys = function (nameQuery) {
	const gateway = this;
	return new Promise(function (resolve, reject) {
		const params = {
			nameQuery: nameQuery,
			includeValues: true
		};
		gateway.apiGateway.getApiKeys(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result.items);
		});
	});
};

/**
 * Get an AWS API Gateway api key
 *
 * @param {String} id
 * @return {Promise}
 */
ApiGateway.prototype.getApiKey = function (id) {
	const gateway = this;
	return new Promise(function (resolve, reject) {
		gateway.apiGateway.getApiKey({apiKey: id}, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Create an AWS API Gateway api key
 *
 * @param {String} name
 * @return {Promise}
 */
ApiGateway.prototype.createApiKey = function (name) {
	const gateway = this;
	return new Promise(function (resolve, reject) {
		const params = {
			name: name,
			enabled: true
		};
		gateway.apiGateway.createApiKey(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Delete an AWS API Gateway api key
 *
 * @param {String} id
 * @return {Promise}
 */
ApiGateway.prototype.deleteApiKey = function (id) {
	const gateway = this;
	return new Promise(function (resolve, reject) {
		gateway.apiGateway.deleteApiKey({apiKey: id}, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
};

module.exports = ApiGateway;