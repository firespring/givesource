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