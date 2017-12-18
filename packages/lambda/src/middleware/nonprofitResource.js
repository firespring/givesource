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
const InvalidPermissionsException = require('./../exceptions/invalidPermissions');
const Middleware = require('./middleware');
const UsersRepository = require('../repositories/users');

/**
 * NonprofitResourceMiddleware constructor
 *
 * @param {String} nonprofitUuid
 * @param {[]} userGroups
 * @constructor
 */
function NonprofitResourceMiddleware(nonprofitUuid, userGroups) {
	this.nonprofitUuid = nonprofitUuid;
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
	const usersRepository = new UsersRepository();
	return new Promise(function (resolve, reject) {
		if (middleware.user.groups && _.intersection(middleware.user.groups, middleware.userGroups).length > 0) {
			return resolve();
		}

		if (middleware.user.uuid) {
			usersRepository.get(middleware.user.uuid).then(function (user) {
				if (middleware.nonprofitUuid === user.nonprofitUuid) {
					return Promise.resolve();
				} else {
					return Promise.reject();
				}
			}).then(function () {
				return resolve();
			}).catch(function () {
				return reject(new InvalidPermissionsException());
			});
		} else {
			reject(new InvalidPermissionsException());
		}
	});
};

module.exports = NonprofitResourceMiddleware;