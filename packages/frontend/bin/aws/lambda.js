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