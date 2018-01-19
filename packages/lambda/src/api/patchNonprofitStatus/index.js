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
const InvalidInputException = require('./../../exceptions/invalidInput');
const InvalidStatusException = require('./../../exceptions/invalidStatus');
const Nonprofit = require('./../../models/nonprofit');
const NonprofitHelper = require('./../../helpers/nonprofit');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const NonprofitUsersRepository = require('./../../repositories/nonprofitUsers');
const Request = require('./../../aws/request');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitsRepository();
	const request = new Request(event, context).parameters(['status']);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));

	let nonprofit = null;
	let status = request.get('status');

	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_uuid'));
	}).then(function (result) {
		nonprofit = new Nonprofit(result);

		if (nonprofit.status !== NonprofitHelper.STATUS_PENDING && nonprofit.status !== NonprofitHelper.STATUS_ACTIVE) {
			return Promise.reject(new InvalidStatusException('Cannot change the status for this nonprofit.'));
		}

		status = request.get('status');
		if (nonprofit.status === NonprofitHelper.STATUS_PENDING && status !== NonprofitHelper.STATUS_ACTIVE && status !== NonprofitHelper.STATUS_DENIED) {
			return Promise.reject(new InvalidInputException('Invalid status for pending nonprofit: ' + status + '.'));
		}

		if (nonprofit.status === NonprofitHelper.STATUS_ACTIVE && status !== NonprofitHelper.STATUS_REVOKED) {
			return Promise.reject(new InvalidInputException('Invalid status for active nonprofit: ' + status + '.'));
		}

		let attributes = {status: status};

		// reset the slug for revoked nonprofits so the slug can be reused
		if (status === NonprofitHelper.STATUS_REVOKED) {
			attributes.slug = '';
		}

		nonprofit.populate(attributes);
	}).then(function () {
		if (status === NonprofitHelper.STATUS_ACTIVE) {
			return repository.generateUniqueSlug(nonprofit).then(function () {
				return nonprofit.validate();
			});
		} else {
			return nonprofit.validate();
		}
	}).then(function () {
		return repository.save(nonprofit);
	}).then(function () {
		if (status === NonprofitHelper.STATUS_DENIED || status === NonprofitHelper.STATUS_REVOKED) {
			return deleteNonprofitUsers(nonprofit);
		} else if (status === NonprofitHelper.STATUS_ACTIVE) {
			return addNonprofitCognitoUsers(nonprofit);
		}
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};

/**
 * Delete this nonprofit's users
 *
 * @param {Nonprofit} nonprofit
 * @return {Promise}
 */
const deleteNonprofitUsers = function (nonprofit) {
	const nonprofitUsersRepository = new NonprofitUsersRepository();
	return nonprofitUsersRepository.getAll(nonprofit.uuid).then(function (users) {
		let promise = Promise.resolve();
		users.forEach(function (user) {
			promise = promise.then(function () {
				return nonprofitUsersRepository.delete(nonprofit.uuid, user.uuid);
			});
		});
		return promise;
	});
};

/**
 * Add Cognito users for this Nonprofit's users
 *
 * @param {Nonprofit} nonprofit
 * @return {Promise}
 */
const addNonprofitCognitoUsers = function (nonprofit) {
	const cognito = new Cognito();
	const nonprofitUsersRepository = new NonprofitUsersRepository();
	const usersRepository = new UsersRepository();

	const userPoolId = process.env.USER_POOL_ID;
	return nonprofitUsersRepository.getAll(nonprofit.uuid).then(function (users) {
		let promise = Promise.resolve();
		users.forEach(function (user) {
			promise = promise.then(function () {
				return cognito.createUser(userPoolId, user.uuid, user.email).then(function (cognitoUser) {
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
				});
			});
		});
	});
};