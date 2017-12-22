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

const AuthPolicy = require('./../aws/authPolicy');
const Middleware = require('../middleware/middleware');

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