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
const Cognito = require('./../../aws/cognito');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const repository = new UsersRepository();
	const request = new Request(event, context).queryParameters(['user_pool_id']);

	let user;
	const groups = [];
	const userPoolId = request.queryParam('user_pool_id');

	request.validate().then(function () {
		return repository.get(request.urlParam('user_uuid'));
	}).then(function (model) {
		user = model;
		return cognito.listGroupsForUser(userPoolId, request.urlParam('user_uuid'));
	}).then(function (response) {
		if (response.hasOwnProperty('Groups')) {
			response.Groups.forEach(function (group) {
				groups.push(group.GroupName);
			});
		}
	}).then(function () {
		callback(null, _.merge({}, user.all(), {groups: groups}));
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};