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
		return cognito.createUser(userPoolId, user.uuid, user.email);
	}).then(function (cognitoUser) {
		logger.log(JSON.stringify(cognitoUser));
		cognitoUser.User.Attributes.forEach(function (attribute) {
			if (attribute.Name === 'sub') {
				user.cognitoUuid = attribute.Value;
			}
		});
	}).then(function () {
		return cognito.assignUserToGroup(userPoolId, user.uuid, 'SuperAdmin');
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