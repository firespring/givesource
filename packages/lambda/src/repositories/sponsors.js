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

const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const Sponsor = require('./../dynamo-models/sponsor');
const SponsorTiersRepository = require('./sponsorTiers');
const loadModels = require('../models/index');

/**
 * SponsorsRepository constructor
 *
 * @constructor
 */
function SponsorsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.SponsorsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
SponsorsRepository.prototype = new Repository();

/**
 * Look to abstract this
 *
 * @param data
 * @return {Promise}
 */
SponsorsRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		return new models.Sponsor(data);
	}).finally(function () {
		return allModels.sequelize.close();
	})
};

/**
 * Get a Sponsor
 *
 * @param {String} sponsorTierId
 * @param {String} id
 * @return {Promise}
 */
SponsorsRepository.prototype.get = function (sponsorTierId, id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Sponsor.findOne({
				where: {
					id: id,
					sponsorTierId: sponsorTierId
				}
			}).then(function (sponsor) {
				if (sponsor instanceof allModels.Sponsor) {
					resolve(sponsor);
				}
				reject(new ResourceNotFoundException('The specified sponsor does not exist.'));
			});
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get all Sponsors for this Sponsor Tier
 *
 * @param {String} sponsorTierId
 * @return {Promise}
 */
SponsorsRepository.prototype.getAll = function (sponsorTierId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Sponsor.findAll({
				where: {
					sponsorTierId: sponsorTierId
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
 * Get a count of all Sponsors for a SponsorTier
 *
 * @param {String} sponsorTierId
 * @return {Promise}
 */
SponsorsRepository.prototype.getCount = function (sponsorTierId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Sponsor.count({
				where: {
					sponsorTierId: sponsorTierId
				}
			});
		}).then(function (result) {
			resolve(result);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Delete a Sponsor
 *
 * @param {String} sponsorTierId
 * @param {String} id
 * @return {Promise}
 */
SponsorsRepository.prototype.delete = function (sponsorTierId, id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Sponsor.destroy({
				where:
					{
						sponsorTierId: sponsorTierId,
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
 * @param {String} sponsorTierId
 * @param {Sponsor} model
 */
SponsorsRepository.prototype.save = function (sponsorTierId, model) {
	let allModels;
	const repository = this;
	const sponsorTierRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			return sponsorTierRepository.get(sponsorTierId);
		}).then(function (sponsorTier) {
			if (!sponsorTier instanceof allModels.SponsorTier) {
				reject('SponsorTier does not exist!');
			}
			return repository.upsert(model, {}, sponsorTierId);
		}).then(function (sponsor) {
			resolve(sponsor);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Batch create or update Sponsors
 *
 * @param {string} sponsorTierId
 * @param {[]} models
 * @return {Promise}
 */
SponsorsRepository.prototype.batchSave = function (sponsorTierId, models) {
	const sponsorTiersRepository = new SponsorTiersRepository();
	const repository = this;
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierId).then(function () {
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
 * Batch delete Sponsors
 *
 * @param {string} sponsorTierId
 * @param {[]} models
 * @return {Promise}
 */
SponsorsRepository.prototype.batchRemove = function (sponsorTierId, models) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			let promise = Promise.resolve();
			promise = promise.then(function () {
				models.forEach(function (model) {
					return model.destroy();
				})
			});
			return promise;
		}).then(function (stuff) {
			resolve(stuff);
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
 * @param sponsorTierId
 * @param model
 * @param data
 * @return {Promise<any>}
 */
SponsorsRepository.prototype.upsert = function (model, data, sponsorTierId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Sponsor.upsert({
				'id': model.get('id'),
				'name': typeof data.name !== "undefined" ? data.name : model.get('name'),
				'url': typeof data.url !== "undefined" ? data.url : model.get('url'),
				'sortOrder': typeof data.sortOrder !== "undefined" ? data.sortOrder : model.get('sortOrder'),
				'fileId': typeof data.fileId !== "undefined" ? data.fileId : model.get('fileId'),
				'logoUrl': typeof data.logoUrl !== "undefined" ? data.logoUrl : model.get('logoUrl'),
				'sponsorTierId': sponsorTierId
			});
		}).then(function (sponsor) {
			resolve(sponsor);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

module.exports = SponsorsRepository;