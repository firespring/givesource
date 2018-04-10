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
const logger = require('./../../helpers/log');
const response = require('cfn-response');
const User = require('./../../models/user');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	logger.log('cognitoCreateUser event: %j', event);

	if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const cognito = new Cognito();
	const userPoolId = event.ResourceProperties.UserPoolId;
	const email = event.ResourceProperties.Email;

	const repository = new UsersRepository();
	const user = new User({email: email});

	user.validate(['uuid', 'createdOn', 'email']).then(function () {
		return cognito.createUser(process.env.AWS_REGION, userPoolId, user.uuid, user.email);
	}).then(function (cognitoUser) {
		logger.log(JSON.stringify(cognitoUser));
		cognitoUser.User.Attributes.forEach(function (attribute) {
			if (attribute.Name === 'sub') {
				user.cognitoUuid = attribute.Value;
			}
		});
	}).then(function () {
		return cognito.assignUserToGroup(process.env.AWS_REGION, userPoolId, user.uuid, 'SuperAdmin');
	}).then(function () {
		return user.validate();
	}).then(function () {
		return repository.save(user);
	}).then(function () {
		response.send(event, context, response.SUCCESS);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});

};