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

const NonprofitDonationTier = require('../models/nonprofitDonationTier');
const NonprofitRepository = require('./nonprofits');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * NonprofitDonationTiersRepository constructor
 *
 * @constructor
 */
function NonprofitDonationTiersRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.NonprofitDonationTiersTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitDonationTiersRepository.prototype = new Repository();

/**
 * Get a Donation Tier
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.get = function (nonprofitUuid, uuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('nonprofitUuid', '=', nonprofitUuid);
			repository.batchQuery(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new NonprofitDonationTier(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified donation tier does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Donation Tiers for a Nonprofit
 *
 * @param {String} nonprofitUuid
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.getAll = function (nonprofitUuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('scan');
			builder.filter('nonprofitUuid', '=', nonprofitUuid);
			repository.batchQuery(builder).then(function (data) {
				const results = [];
				if (data.Items) {
					data.Items.forEach(function (item) {
						results.push(new NonprofitDonationTier(item));
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
 * Delete a Donation Tier
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.delete = function (nonprofitUuid, uuid) {
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
 * Create or update a Donation Tier
 *
 * @param {String} nonprofitUuid
 * @param {NonprofitDonationTier} model
 */
NonprofitDonationTiersRepository.prototype.save = function (nonprofitUuid, model) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			if (!(model instanceof NonprofitDonationTier)) {
				reject(new Error('invalid NonprofitDonationTier model'));
			}
			model.validate().then(function () {
				const key = {
					uuid: model.uuid
				};
				repository.put(key, model.except(['uuid'])).then(function (data) {
					resolve(new NonprofitDonationTier(data.Attributes));
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

/**
 * Batch create or update Donation Tiers
 *
 * @param {string} nonprofitUuid
 * @param {[]} models
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.batchSave = function (nonprofitUuid, models) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			return repository.batchUpdate(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete Donation Tiers
 *
 * @param {string} nonprofitUuid
 * @param {[]} models
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.batchRemove = function (nonprofitUuid, models) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			return repository.batchDelete(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = NonprofitDonationTiersRepository;