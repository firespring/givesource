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

const NonprofitDonationTier = require('../dynamo-models/nonprofitDonationTier');
const NonprofitRepository = require('./nonprofits');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const loadModels = require('../models/index');
const Sequelize = require('sequelize');

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
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		const nonprofitDonationTier = new models.NonprofitDonationTier();
		return new nonprofitDonationTier.constructor(data, {isNewRecord: typeof data.id === 'undefined'});
	}).finally(function () {
		return allModels.sequelize.close();
	});
};

/**
 * Batch Get nonprofit donation tiers by ID
 *
 * @param {[]} ids
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.batchGet = function (ids) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (ids.length) {
				return allModels.NonprofitDonationTier.findAll({
					where: {
						id: {
							[Sequelize.Op.or]: ids
						}
					}
				});
			} else {
				reject('IDs must be provided to update.')
			}
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
 * Get a Donation Tier
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.get = function (nonprofitId, id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.NonprofitDonationTier.findOne({
				where: {
					id: id,
					nonprofitId: nonprofitId
				}
			});
		}).then(function (nonprofitDonationTier) {
			if (nonprofitDonationTier instanceof allModels.NonprofitDonationTier) {
				resolve(nonprofitDonationTier);
			}
			reject(new ResourceNotFoundException('The specified nonprofitDonationTier does not exist.'));
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get all Donation Tiers for a Nonprofit
 *
 * @param {String} nonprofitId
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.getAll = function (nonprofitId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.NonprofitDonationTier.findAll({
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
 * Delete a Donation Tier
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.delete = function (nonprofitId, id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.NonprofitDonationTier.destroy({
				where:
					{
						nonprofitId: nonprofitId,
						id: id
					}
			});
		}).then(function () {
			resolve()
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Create or update a Donation Tier
 *
 * @param {String} nonprofitId
 * @param {NonprofitDonationTier} model
 */
NonprofitDonationTiersRepository.prototype.save = function (nonprofitId, model) {
	let allModels;
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			return nonprofitRepository.get(nonprofitId);
		}).then(function () {
			return repository.upsert(model, {});
		}).then(function (nonprofitDonationTier) {
			resolve(nonprofitDonationTier);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Batch create or update Donation Tiers
 *
 * @param {string} nonprofitId
 * @param {[]} models
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.batchSave = function (nonprofitId, models) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitId).then(function () {
			let promise = Promise.resolve();
			promise = promise.then(function () {
				models.forEach(function (model) {
					return repository.upsert(model, {})
				})
			});
			return promise;
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
 * @param {string} nonprofitId
 * @param {[]} models
 * @return {Promise}
 */
NonprofitDonationTiersRepository.prototype.batchRemove = function (nonprofitId, models) {
	let allModels;
	const ids = models.map(function (model) {
		return model.id;
	});
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.NonprofitDonationTier.destroy({
				where: {
					id: {
						[Sequelize.Op.in]: ids
					},
					nonprofitId: nonprofitId
				}
			});
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Bulk create NonprofitDonationTiers (seeder)
 *
 * @param nonprofitDonationTiers
 * @return {Promise<any>}
 */
NonprofitDonationTiersRepository.prototype.batchUpdate = function (nonprofitDonationTiers) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			return allModels.NonprofitDonationTier.bulkCreate(nonprofitDonationTiers);
		}).then(function (savedNonprofitDonationTiers) {
			resolve(savedNonprofitDonationTiers);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Insert or update the model
 *
 * @param {Object} model
 * @param {Object} data
 * @return {Promise<any>}
 */
NonprofitDonationTiersRepository.prototype.upsert = function (model, data) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (typeof model === 'undefined') {
				const content = new allModels.NonprofitDonationTier();
				model = new content.constructor({}, {isNewRecord: typeof data.id === 'undefined'});
			}
			return allModels.NonprofitDonationTier.upsert({
				'id': model.get('id'),
				'amount': typeof data.amount !== "undefined" ? data.amount : model.amount,
				'value': typeof data.value !== "undefined" ? data.value : model.value,
				'description': typeof data.description !== "undefined" ? data.description : model.description,
				'nonprofitId': typeof data.nonprofitId !== "undefined" ? data.nonprofitId : model.nonprofitId,
			});
		}).then(function (nonprofit) {
			resolve(nonprofit);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

module.exports = NonprofitDonationTiersRepository;