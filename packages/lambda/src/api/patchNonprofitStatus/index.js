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
const InvalidInputException = require('./../../exceptions/invalidInput');
const InvalidStatusException = require('./../../exceptions/invalidStatus');
const Lambda = require('./../../aws/lambda');
const Nonprofit = require('./../../models/nonprofit');
const NonprofitHelper = require('./../../helpers/nonprofit');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const NonprofitUsersRepository = require('./../../repositories/nonprofitUsers');
const Request = require('./../../aws/request');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
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
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
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
	const cognito = new Cognito();
	const nonprofitUsersRepository = new NonprofitUsersRepository();

	return nonprofitUsersRepository.getAll(nonprofit.uuid).then(function (users) {
		let promise = Promise.resolve();
		users.forEach(function (user) {
			promise = promise.then(function () {
				return cognito.deleteUser(process.env.AWS_REGION, process.env.USER_POOL_ID, user.uuid)
			}).then(function () {
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

	return nonprofitUsersRepository.getAll(nonprofit.uuid).then(function (users) {
		let promise = Promise.resolve();
		users.forEach(function (user) {
			promise = promise.then(function () {
				return cognito.createUser(process.env.AWS_REGION, process.env.USER_POOL_ID, user.uuid, user.email).then(function (cognitoUser) {
					cognitoUser.User.Attributes.forEach(function (attribute) {
						if (attribute.Name === 'sub') {
							user.cognitoUuid = attribute.Value;
						}
					});
				}).then(function () {
					return cognito.assignUserToGroup(process.env.AWS_REGION, process.env.USER_POOL_ID, user.uuid, 'Nonprofit');
				}).then(function () {
					return user.validate();
				}).then(function () {
					return usersRepository.save(user);
				});
			});
		});
	});
};