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

const User = require('./../dynamo-models/user');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * UsersRepository constructor
 *
 * @constructor
 */
function UsersRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.UsersTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
UsersRepository.prototype = new Repository();

/**
 * Get a User
 *
 * @param {String} uuid
 * @return {Promise}
 */
UsersRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new User(data.Item));
			}
			reject(new ResourceNotFoundException('The specified user does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Users
 *
 * @return {Promise}
 */
UsersRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new User(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all admin Users
 *
 * @return {Promise}
 */
UsersRepository.prototype.getAdminUsers = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const params = {
			FilterExpression: 'attribute_not_exists(nonprofitUuid)'
		};
		repository.batchScan(params).then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new User(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a User
 *
 * @param {String} uuid
 * @return {Promise}
 */
UsersRepository.prototype.delete = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.deleteByKey('uuid', uuid).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Create or update a User
 *
 * @param {User} model
 */
UsersRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof User)) {
			reject(new Error('invalid User model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new User(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = UsersRepository;