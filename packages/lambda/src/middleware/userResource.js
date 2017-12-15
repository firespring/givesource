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

/**
 * UserResourceMiddleware constructor
 *
 * @param {String} userUuid
 * @constructor
 */
function UserResourceMiddleware(userUuid) {
	this.userUuid = userUuid;
}

/**
 * Extend the base Middleware
 *
 * @type {Middleware}
 */
UserResourceMiddleware.prototype = new Middleware();

/**
 * Handle the middleware
 *
 * @return {Promise}
 */
UserResourceMiddleware.prototype.handle = function () {
	const middleware = this;
	return new Promise(function (resolve, reject) {

		if (middleware.user.uuid === middleware.userUuid) {
			return resolve();
		}

		reject(new InvalidPermissionsException());
	});
};

module.exports = NonprofitResourceMiddleware;