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
 * Lambda constructor
 *
 * @constructor
 */
function Lambda() {
}

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

module.exports = Lambda;