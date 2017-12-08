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

const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const Sponsor = require('./../models/sponsor');
const SponsorTiersRepository = require('./sponsorTiers');

/**
 * SponsorsRepository constructor
 *
 * @constructor
 */
function SponsorsRepository() {
	Repository.call(this, RepositoryHelper.SponsorsTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
SponsorsRepository.prototype = new Repository();

/**
 * Get a Sponsor
 *
 * @param {String} sponsorTierUuid
 * @param {String} uuid
 * @return {Promise}
 */
SponsorsRepository.prototype.get = function (sponsorTierUuid, uuid) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('sponsorTierUuid', '=', sponsorTierUuid);
			repository.query(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new Sponsor(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified sponsor does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Sponsors for this Sponsor Tier
 *
 * @param {String} sponsorTierUuid
 * @return {Promise}
 */
SponsorsRepository.prototype.getAll = function (sponsorTierUuid) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.index('sponsorTierUuidIndex').condition('sponsorTierUuid', '=', sponsorTierUuid);
			repository.query(builder).then(function (data) {
				const results = [];
				if (data.Items) {
					data.Items.forEach(function (item) {
						results.push(new Sponsor(item));
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
 * Get a count of all Sponsors for a SponsorTier
 *
 * @param {String} sponsorTierUuid
 * @return {Promise}
 */
SponsorsRepository.prototype.getCount = function (sponsorTierUuid) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.index('sponsorTierUuidIndex').condition('sponsorTierUuid', '=', sponsorTierUuid).select('COUNT');
			repository.query(builder).then(function (data) {
				resolve(data.Count);
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a Sponsor
 *
 * @param {String} sponsorTierUuid
 * @param {String} uuid
 * @return {Promise}
 */
SponsorsRepository.prototype.delete = function (sponsorTierUuid, uuid) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
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
 * @param {String} sponsorTierUuid
 * @param {Sponsor} model
 */
SponsorsRepository.prototype.save = function (sponsorTierUuid, model) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
			if (!(model instanceof Sponsor)) {
				reject(new Error('invalid Sponsor model'));
			}
			model.validate().then(function () {
				const key = {
					uuid: model.uuid
				};
				repository.put(key, model.except(['uuid'])).then(function (data) {
					resolve(new Sponsor(data.Attributes));
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
 * Batch create or update Sponsors
 *
 * @param {string} sponsorTierUuid
 * @param {[]} models
 * @return {Promise}
 */
SponsorsRepository.prototype.batchSave = function (sponsorTierUuid, models) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
			return repository.batchUpdate(models);
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
 * @param {string} sponsorTierUuid
 * @param {[]} models
 * @return {Promise}
 */
SponsorsRepository.prototype.batchRemove = function (sponsorTierUuid, models) {
	const repository = this;
	const sponsorTiersRepository = new SponsorTiersRepository();
	return new Promise(function (resolve, reject) {
		sponsorTiersRepository.get(sponsorTierUuid).then(function () {
			return repository.batchDelete(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = SponsorsRepository;