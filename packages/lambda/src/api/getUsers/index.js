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
const Cognito = require('./../../aws/cognito');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UsersRepository = require('./../../repositories/users');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const _ = require('lodash');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const repository = new UsersRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));
	const userPoolId = process.env.USER_POOL_ID;

	let results = [];
	request.validate().then(function () {
		return repository.getAdminUsers();
	}).then(function (users) {
		let promise = Promise.resolve();

		users.forEach(function (user) {
			let result = user.all();
			promise = promise.then(function () {
				return cognito.listGroupsForUser(userPoolId, user.uuid).then(function (response) {
					result.group = _.get(response.Groups[0], 'GroupName', 'SuperAdmin');
					results.push(result);
				});
			});
		});

		return promise;
	}).then(function () {
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};