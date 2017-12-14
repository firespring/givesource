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

const Middleware = require('./middleware');

/**
 * UserGroupMiddleware constructor
 *
 * @constructor
 */
function UserEmailMiddleware() {
}

/**
 * Extend the base Middleware
 *
 * @type {Middleware}
 */
UserEmailMiddleware.prototype = new Middleware();

/**
 * Handle the middleware
 *
 * @return {Promise}
 */
UserEmailMiddleware.prototype.handle = function () {
	const middleware = this;
	return new Promise(function (resolve, reject) {

		if (!middleware.payload.hasOwnProperty('email') || !middleware.payload.email) {
			reject(new Error('User email is invalid'));
			return;
		}

		if (!middleware.payload.hasOwnProperty('email_verified') || !middleware.payload.email_verified) {
			reject(new Error('User email is not verified'));
			return;
		}

		resolve();
	});
};

module.exports = UserEmailMiddleware;