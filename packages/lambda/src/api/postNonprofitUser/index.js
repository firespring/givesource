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
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const User = require('./../../models/user');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const cognito = new Cognito();
	const nonprofitsRepository = new NonprofitsRepository();
	const usersRepository = new UsersRepository();
	const request = new Request(event, context).parameters(['email_addresses']);

	const userPoolId = process.env.USER_POOL_ID;
	const emailAddresses = request.get('email_addresses');
	request.validate().then(function () {
		return nonprofitsRepository.get(request.urlParam('nonprofit_uuid'));
	}).then(function (nonprofit) {
		return new Promise(function (resolve, reject) {
			const users = [];
			let promise = Promise.resolve();
			emailAddresses.split(',').forEach(function (email) {
				email = email.trim();
				const user = new User({email: email, nonprofitUuid: nonprofit.uuid});
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
						return cognito.assignUserToGroup(userPoolId, user.uuid, 'Nonprofit');
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
