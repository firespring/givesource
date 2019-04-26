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

const AWS = require('aws-sdk');

/**
 * ApiGateway constructor
 *
 * @constructor
 */
function ApiGateway() {
}

/**
 * Deploy an AWS API Gateway
 *
 * @param {String} region
 * @param {String} restApiId
 * @param {String} stageName
 * @return {Promise}
 */
ApiGateway.prototype.deploy = function (region, restApiId, stageName) {
	const awsApiGateway = new AWS.APIGateway({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			restApiId: restApiId,
			stageName: stageName
		};
		awsApiGateway.createDeployment(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Flush the cache for an AWS API Gateway stage
 *
 * @param {String} region
 * @param {String} restApiId
 * @param {String} stageName
 * @return {Promise}
 */
ApiGateway.prototype.flushStageCache = function (region, restApiId, stageName) {
	const awsApiGateway = new AWS.APIGateway({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			restApiId: restApiId,
			stageName: stageName
		};
		awsApiGateway.flushStageCache(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Get the api keys of an AWS API Gateway
 *
 * @param {String} region
 * @param {String} nameQuery
 * @return {Promise}
 */
ApiGateway.prototype.getApiKeys = function (region, nameQuery) {
	const awsApiGateway = new AWS.APIGateway({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			nameQuery: nameQuery,
			includeValues: true
		};
		awsApiGateway.getApiKeys(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data.items);
		});
	});
};

/**
 * Get an AWS API Gateway api key
 *
 * @param {String} region
 * @param {String} id
 * @return {Promise}
 */
ApiGateway.prototype.getApiKey = function (region, id) {
	const awsApiGateway = new AWS.APIGateway({region: region});
	return new Promise(function (resolve, reject) {
		awsApiGateway.getApiKey({apiKey: id}, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Create an AWS API Gateway api key
 *
 * @param {String} region
 * @param {String} name
 * @return {Promise}
 */
ApiGateway.prototype.createApiKey = function (region, name) {
	const awsApiGateway = new AWS.APIGateway({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			name: name,
			enabled: true
		};
		awsApiGateway.createApiKey(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Delete an AWS API Gateway api key
 *
 * @param {String} region
 * @param {String} id
 * @return {Promise}
 */
ApiGateway.prototype.deleteApiKey = function (region, id) {
	const awsApiGateway = new AWS.APIGateway({region: region});
	return new Promise(function (resolve, reject) {
		awsApiGateway.deleteApiKey({apiKey: id}, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

module.exports = ApiGateway;