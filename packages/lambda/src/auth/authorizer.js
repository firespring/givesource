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

const AuthPolicy = require('./../aws/authPolicy');

/**
 * Authorizer constructor
 *
 * @param {String} arn
 * @constructor
 */
function Authorizer(arn) {
	this.arn = arn;
	this.payload = {};
	this.principalId = null;
}

/**
 * Issue AuthPolicy
 *
 * @param {Boolean} allow
 * @return {Promise}
 */
Authorizer.prototype.issueAuthPolicy = function (allow) {
	const authorizer = this;

	const apiOptions = {};
	const tmp = authorizer.arn.split(':');
	const apiGatewayArnTmp = tmp[5].split('/');
	const awsAccountId = tmp[4];
	apiOptions.region = tmp[3];
	apiOptions.restApiId = apiGatewayArnTmp[0];
	apiOptions.stage = apiGatewayArnTmp[1];

	const policy = new AuthPolicy(authorizer.principalId, awsAccountId, apiOptions);
	if (allow) {
		policy.allowAllMethods();
	} else {
		policy.denyAllMethods();
	}

	return Promise.resolve(policy.build());
};

/**
 * Authorize the request
 *
 * @return {Promise}
 */
Authorizer.prototype.authorize = function () {
	const authorizer = this;

	authorizer.principalId = 'default';
	return authorizer.issueAuthPolicy(true);
};

module.exports = Authorizer;