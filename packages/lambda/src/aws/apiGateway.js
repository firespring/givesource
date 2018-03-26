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
 * ApiGateway constructor
 *
 * @constructor
 */
function ApiGateway() {
	this.apiGateway = new AWS.APIGateway({region: process.env.AWS_REGION});
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
			restApiId: restApiId,
			stageName: stageName
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