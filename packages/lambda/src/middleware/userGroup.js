/*
 * Copyright 2019 Firespring, Inc.
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

const _ = require('lodash');
const InvalidPermissionsException = require('./../exceptions/invalidPermissions');
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
		if (!middleware.user.groups || _.intersection(middleware.user.groups, middleware.userGroups).length === 0) {
			reject(new InvalidPermissionsException());
		}
		resolve();
	});
};

module.exports = UserGroupMiddleware;