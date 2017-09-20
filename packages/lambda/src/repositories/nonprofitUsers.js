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

const User = require('../models/user');
const NonprofitRepository = require('../repositories/nonprofits');
const QueryBuilder = require('../aws/queryBuilder');
const Repository = require('../repositories/repository');
const RepositoryHelper = require('../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * NonprofitUsersRepository constructor
 *
 * @constructor
 */
function NonprofitUsersRepository() {
	Repository.call(this, RepositoryHelper.UsersTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitUsersRepository.prototype = new Repository();

/**
 * Get a Donation
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.get = function (nonprofitUuid, uuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('nonprofitUuid', '=', nonprofitUuid);
			repository.query(builder).then(function (data) {
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
 * @param {String} nonprofitUuid
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.getAll = function (nonprofitUuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('scan');
			builder.filter('nonprofitUuid', '=', nonprofitUuid);
			repository.query(builder).then(function (data) {
				const results = [];
				if (data.Items) {
					data.Items.forEach(function (item) {
						results.push(new User(item));
					});
				}
				resolve(results);
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a User
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.delete = function (nonprofitUuid, uuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			repository.deleteByKey('uuid', uuid).then(function () {
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
 * Create or update a Donation
 *
 * @param {String} nonprofitUuid
 * @param {Donation} model
 */
NonprofitUsersRepository.prototype.save = function (nonprofitUuid, model) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			if (!(model instanceof User)) {
				reject(new Error('invalid Donation model'));
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
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = NonprofitUsersRepository;