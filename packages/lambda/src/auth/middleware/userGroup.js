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

/**
 * UserGroupMiddleware constructor
 *
 * @param {[]} userGroups
 * @constructor
 */
function UserGroupMiddleware(userGroups) {
	this.userGroups = userGroups;
}

/**
 * Extend the base Middleware
 *
 * @type {Middleware}
 */
UserGroupMiddleware.prototype = new Middleware();

/**
 * Handle the middleware
 *
 * @return {Promise}
 */
UserGroupMiddleware.prototype.handle = function () {
	const middleware = this;
	return new Promise(function (resolve, reject) {

		if (!middleware.payload.hasOwnProperty('cognito:groups') || _.intersection(middleware.payload['cognito:groups'], middleware.userGroups).length === 0) {
			reject(new Error('Invalid permissions to resource'));
			return;
		}

		resolve();
	});
};

module.exports = UserGroupMiddleware;