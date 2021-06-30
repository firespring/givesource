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
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const UsersRepository = require('./../../repositories/users');
const UUID = require('node-uuid');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const nonprofitsRepository = new NonprofitsRepository();
	const usersRepository = new UsersRepository();
	const request = new Request(event, context).parameters(['email_addresses']);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_id'), ['SuperAdmin', 'Admin']));

	const userPoolId = process.env.USER_POOL_ID;
	const emailAddresses = request.get('email_addresses');
	request.validate().then(function () {
		return nonprofitsRepository.get(request.urlParam('nonprofit_id'));
	}).then(function (nonprofit) {
		return new Promise(function (resolve, reject) {
			const users = [];
			let promise = Promise.resolve();
			emailAddresses.split(',').forEach(function (email) {
				email = email.trim();
				let user;
				promise = promise.then(function () {
					return usersRepository.populate({email: email, cognitoUsername: UUID.v4(), nonprofitId: nonprofit.id}).then(function (populatedUser) {
						user = populatedUser;
						return cognito.createUser(process.env.AWS_REGION, userPoolId, user.cognitoUsername, user.email);
					}).then(function (cognitoUser) {
						cognitoUser.User.Attributes.forEach(function (attribute) {
							if (attribute.Name === 'sub') {
								user.cognitoUuid = attribute.Value;
							}
						});
					}).then(function () {
						return cognito.assignUserToGroup(process.env.AWS_REGION, userPoolId, user.cognitoUsername, 'Nonprofit');
					}).then(function () {
						return usersRepository.upsert(user, {});
					}).then(function (savedUser) {
						users.push(savedUser[0]);
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
