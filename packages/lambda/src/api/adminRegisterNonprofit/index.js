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
const Lambda = require('./../../aws/lambda');
const NonprofitHelper = require('./../../helpers/nonprofit');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const UsersRepository = require('./../../repositories/users');
const UUID = require('node-uuid');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const lambda = new Lambda();
	const nonprofitsRepository = new NonprofitsRepository();
	const usersRepository = new UsersRepository();

	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['nonprofit', 'user']);
	const userPoolId = process.env.USER_POOL_ID;

	let user;
	let nonprofit;
	let savedNp;
	request.validate().then(function () {
		return nonprofitsRepository.populate(request.get('nonprofit'));
	}).then(function (populatedNp) {
		nonprofit = populatedNp;
		return nonprofitsRepository.generateUniqueSlug(nonprofit);
	}).then(function () {
		nonprofit.status = NonprofitHelper.STATUS_ACTIVE;
		return nonprofitsRepository.upsert(nonprofit, {});
	}).then(function (nonprofit) {
		savedNp = nonprofit[0];
		return usersRepository.populate(request.get('user'));
	}).then(function (populatedUser) {
		user = populatedUser;
		user.cognitoUsername = UUID.v4();
		user.nonprofitId = savedNp.id;
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
		return user.validate();
	}).then(function () {
		return usersRepository.upsert(user, {});
	}).then(function () {
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
	}).then(function () {
		callback(null, {
			nonprofit: nonprofit,
			user: user
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};