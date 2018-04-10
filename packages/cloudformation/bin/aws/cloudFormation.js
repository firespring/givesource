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
 * CloudFormation constructor
 *
 * @constructor
 */
function CloudFormation() {
}

/**
 * Create an AWS CloudFormation stack
 *
 * @param {String} region
 * @param {String} stackName
 * @param {String} templateUrl
 * @param {[]} parameters
 * @return {Promise}
 */
CloudFormation.prototype.createStack = function (region, stackName, templateUrl, parameters) {
	const awsCloudformation = new AWS.CloudFormation({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			Capabilities: ['CAPABILITY_IAM'],
			StackName: stackName,
			TemplateURL: templateUrl
		};
		if (parameters.length) {
			params.Parameters = parameters;
		}
		awsCloudformation.createStack(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Delete an AWS CloudFormation stack
 *
 * @param {String} region
 * @param {String} stackName
 * @return {Promise}
 */
CloudFormation.prototype.deleteStack = function (region, stackName) {
	const awsCloudformation = new AWS.CloudFormation({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			StackName: stackName,
		};
		awsCloudformation.deleteStack(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Update an AWS CloudFormation stack
 *
 * @param {String} region
 * @param {String} stackName
 * @param {String} templateUrl
 * @param {[]} parameters
 * @return {Promise}
 */
CloudFormation.prototype.updateStack = function (region, stackName, templateUrl, parameters) {
	const awsCloudformation = new AWS.CloudFormation({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			Capabilities: ['CAPABILITY_IAM'],
			StackName: stackName,
			TemplateURL: templateUrl
		};
		if (parameters.length) {
			params.Parameters = parameters;
		}
		awsCloudformation.updateStack(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports = CloudFormation;