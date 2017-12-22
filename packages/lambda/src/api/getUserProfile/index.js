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
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const repository = new UsersRepository();
	const request = new Request(event, context);

	request.validate().then(function () {
		if (request.user().uuid) {
			return repository.get(request.user().uuid);
		} else {
			return Promise.reject(new HttpException('Unable to retrieve user'));
		}
	}).then(function (user) {
		const groups = request.user().groups || [];
		callback(null, _.merge({}, user.all(), {groups: groups}));
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};