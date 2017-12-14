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
const Middleware = require('./middleware/middleware');

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

	this._middleware = [];
}

/**
 * Add Authorizer middleware
 */
Authorizer.prototype.middleware = function (middleware) {
	if (middleware instanceof Middleware) {
		this._middleware.push(middleware);
	}
};

/**
 * Process Authorizer middleware
 *
 * @return {Promise}
 */
Authorizer.prototype.processMiddleware = function () {
	const authorizer = this;

	let promise = Promise.resolve();
	authorizer._middleware.forEach(function (middleware) {
		promise = promise.then(function () {
			middleware.prepare(authorizer.payload);
			return middleware.handle();
		});
	});

	return promise;
};

/**
 * Issue an AuthPolicy
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

	const method = apiGatewayArnTmp[2];
	let resource = '/';
	if (apiGatewayArnTmp[3]) {
		resource += apiGatewayArnTmp.slice(3, apiGatewayArnTmp.length).join('/');
	}

	const policy = new AuthPolicy(authorizer.principalId, awsAccountId, apiOptions);
	if (allow) {
		policy.allowMethod(method, resource);
	} else {
		policy.denyMethod(method, resource);
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
	return new Promise(function (resolve, reject) {
		authorizer.principalId = 'default';
		authorizer.processMiddleware().then(function () {
			return authorizer.issueAuthPolicy(true).then(function (policy) {
				resolve(policy);
			});
		}).catch(function () {
			return authorizer.issueAuthPolicy(false).then(function (policy) {
				resolve(policy);
			});
		});
	});
};

module.exports = Authorizer;