/*
 * Copyright 2018 Firespring, Inc.
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
const User = require('./../../models/user');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const usersRepository = new UsersRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['email_addresses']);

	const userPoolId = process.env.USER_POOL_ID;
	const emailAddresses = request.get('email_addresses');
	request.validate().then(function () {
		return new Promise(function (resolve, reject) {
			const users = [];
			let promise = Promise.resolve();
			emailAddresses.split(',').forEach(function (email) {
				email = email.trim();
				const user = new User({email: email});
				promise = promise.then(function () {
					return user.validate(['uuid', 'createdOn', 'email']).then(function () {
						return cognito.createUser(userPoolId, user.uuid, user.email);
					}).then(function (cognitoUser) {
						cognitoUser.User.Attributes.forEach(function (attribute) {
							if (attribute.Name === 'sub') {
								user.cognitoUuid = attribute.Value;
							}
						});
					}).then(function () {
						return cognito.assignUserToGroup(userPoolId, user.uuid, 'Admin');
					}).then(function () {
						return user.validate();
					}).then(function () {
						return usersRepository.save(user);
					}).then(function () {
						users.push(user.all());
					}).catch(function (err) {
						reject(err);
					});
				});
			});
			promise = promise.then(function () {
				resolve(users);
			});
		});
	}).then(function (users) {
		callback(null, {
			users: users
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};