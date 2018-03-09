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

/**
 * Lambda constructor
 *
 * @constructor
 */
function Lambda() {
}

/**
 * Create a new AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @param {String} handler
 * @param {String} role
 * @param {String} runtime
 * @param {{}} code
 * @param {{}} [env]
 * @return {Promise}
 */
Lambda.prototype.createFunction = function (region, functionName, handler, role, runtime, code, env) {
	const awsLambda = new AWS.Lambda({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			Code: code,
			FunctionName: functionName,
			Handler: handler,
			Role: role,
			Runtime: runtime,
		};

		env = env || {};
		if (Object.keys(env).length) {
			params.Environment = {};
			params.Environment.Variables = env;
		}

		awsLambda.createFunction(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Delete an AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @return {Promise}
 */
Lambda.prototype.deleteFunction = function (region, functionName) {
	const awsLambda = new AWS.Lambda({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			FunctionName: functionName
		};
		awsLambda.deleteFunction(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Get an AWS Lambda function
 *
 * @param {String} functionName
 * @return {Promise}
 */
Lambda.prototype.getFunction = function (functionName) {
	const awsLambda = new AWS.Lambda({region: process.env.AWS_REGION});
	return new Promise(function (resolve, reject) {
		const params = {
			FunctionName: functionName
		};
		awsLambda.getFunction(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Invoke an AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @param {{}} payload
 * @param {String} [invocationType]
 * @return {Promise}
 */
Lambda.prototype.invoke = function (region, functionName, payload, invocationType) {
	const awsLambda = new AWS.Lambda({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			FunctionName: functionName,
			Payload: JSON.stringify(payload),
			InvocationType: invocationType || 'Event'
		};
		awsLambda.invoke(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Publish a new AWS Lambda function version
 *
 * @param {String} region
 * @param {String} functionName
 * @return {Promise}
 */
Lambda.prototype.publishVersion = function (region, functionName) {
	const awsLambda = new AWS.Lambda({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			FunctionName: functionName
		};
		awsLambda.publishVersion(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Update an AWS Lambda function's code
 *
 * @param {String} region
 * @param {String} functionName
 * @param {*} zipFile
 * @return {Promise}
 */
Lambda.prototype.updateFunctionCode = function (region, functionName, zipFile) {
	const awsLambda = new AWS.Lambda({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			FunctionName: functionName,
			ZipFile: zipFile
		};
		awsLambda.updateFunctionCode(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports = Lambda;