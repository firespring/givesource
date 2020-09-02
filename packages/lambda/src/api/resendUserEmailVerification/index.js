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

const Cognito = require('./../../aws/cognito');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const User = require('./../../dynamo-models/user');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const repository = new UsersRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin', 'Nonprofit']));

	let user = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('user_id'));
	}).then(function (result) {
		user = new User(result);
		user.populate(request._body);
		return user.validate();
	}).then(function () {
		return cognito.createUser(process.env.AWS_REGION, process.env.USER_POOL_ID, user.uuid, user.email, true).catch(function (err) {
			if (err.code === 'UserNotFoundException') {
				return cognito.createUser(process.env.AWS_REGION, process.env.USER_POOL_ID, user.uuid, user.email);
			} else {
				return Promise.reject(err);
			}
		});
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};