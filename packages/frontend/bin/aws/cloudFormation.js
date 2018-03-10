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
 * CloudFormation constructor
 *
 * @constructor
 */
function CloudFormation() {
}

/**
 * Describe AWS CloudFormation stack(s)
 *
 * @param {String} region
 * @param {String} [stackName]
 * @param {String} [nextToken]
 * @param {[]} [stacks]
 * @return {Promise}
 */
CloudFormation.prototype.describeStacks = function (region, stackName, nextToken, stacks) {
	const cloudFormation = this;
	const awsCloudFormation = new AWS.CloudFormation({region: region});
	return new Promise(function (resolve, reject) {
		stacks = stacks || [];
		const params = {};
		if (stackName) {
			params.StackName = stackName;
		}
		if (nextToken) {
			params.NextToken = nextToken;
		}
		awsCloudFormation.describeStacks(params, function (err, data) {
			if (err) {
				reject(err);
			}
			stacks = stacks.concat(data.Stacks);
			if (data.NextToken) {
				resolve(cloudFormation.describeStacks(region, stackName, data.nextToken, stacks));
			} else {
				resolve(stacks);
			}
		});
	});
};

module.exports = CloudFormation;