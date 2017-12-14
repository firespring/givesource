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

const Request = require('./../../aws/request');
const UserAuthorizer = require('./../../auth/user');
const UserEmailMiddleware = require('./../../auth/middleware/userEmail');
const UserGroupMiddleware = require('./../../auth/middleware/userGroup');

exports.handle = function (event, context, callback) {
	new Request(event, context);

	const arn = event.methodArn;
	const region = process.env.REGION;
	const token = event.authorizationToken;
	const userPoolId = process.env.USER_POOL_ID;

	const authorizer = new UserAuthorizer(arn, region, token, userPoolId);
	authorizer.middleware(new UserEmailMiddleware());
	authorizer.middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	authorizer.authorize().then(function (policy) {
		callback(null, policy);
	}).catch(function () {
		callback('Unauthorized');
	});
};