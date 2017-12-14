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

const _ = require('lodash');
const Middleware = require('./middleware');
const UsersRepository = require('./../../repositories/users');

/**
 * NonprofitResourceMiddleware constructor
 *
 * @param {[]} userGroups
 * @constructor
 */
function NonprofitResourceMiddleware(userGroups) {
	this.userGroups = userGroups;
}

/**
 * Extend the base Middleware
 *
 * @type {Middleware}
 */
NonprofitResourceMiddleware.prototype = new Middleware();

/**
 * Handle the middleware
 *
 * @return {Promise}
 */
NonprofitResourceMiddleware.prototype.handle = function () {
	const middleware = this;
	return new Promise(function (resolve, reject) {
		const usersRepository = new UsersRepository();

		if (middleware.payload.hasOwnProperty('cognito:groups') && _.intersection(middleware.payload['cognito:groups'], middleware.userGroups).length > 0) {
			return resolve();
		}

		if (middleware.payload.hasOwnProperty('cognito:username')) {
			const uuid = middleware.payload['cognito:username'];
			usersRepository.get(uuid).then(function (user) {
				const tmp = authorizer.arn.split(':');
				const apiGatewayArnTmp = tmp[5].split('/');
				let resource = '/';
				if (apiGatewayArnTmp[3]) {
					resource += apiGatewayArnTmp.slice(3, apiGatewayArnTmp.length).join('/');
				}
				const nonprofitUuid = user.nonprofitUuid || '';
				if (resource.indexOf(nonprofitUuid) > -1) {
					return Promise.resolve();
				} else {
					return Promise.reject();
				}
			}).then(function () {
				return resolve();
			});
		}

		return reject();
	});
};

module.exports = NonprofitResourceMiddleware;