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

const NonprofitRepository = require('./nonprofits');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const User = require('./../dynamo-models/user');
const loadModels = require('../models/index');
const Sequelize = require('sequelize');

/**
 * NonprofitUsersRepository constructor
 *
 * @constructor
 */
function NonprofitUsersRepository(options) {
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
NonprofitUsersRepository.prototype = new Repository();

/**
 * Get a User
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.get = function (nonprofitId, id) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitId).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('id', '=', id).filter('nonprofitId', '=', nonprofitId);
			repository.batchQuery(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new User(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified user does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Users for a Nonprofit
 *
 * @param {String} nonprofitId
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.getAll = function (nonprofitId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.User.findAll({
				where: {
					nonprofitId: nonprofitId
				}
			});
		}).then(function (results) {
			resolve(results);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Delete a User
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.delete = function (nonprofitId, id) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitId).then(function () {
			repository.deleteByKey('id', id).then(function () {
				resolve();
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		})
	});
};

/**
 * Create or update a User
 *
 * @param {String} nonprofitId
 * @param {User} model
 */
NonprofitUsersRepository.prototype.save = function (nonprofitId, model) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitId).then(function () {
			if (!(model instanceof User)) {
				reject(new Error('invalid User model'));
			}
			model.validate().then(function () {
				const key = {
					id: model.id
				};
				repository.put(key, model.except(['id'])).then(function (data) {
					resolve(new User(data.Attributes));
				}).catch(function (err) {
					reject(err);
				});
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = NonprofitUsersRepository;