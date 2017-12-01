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
const SponsorTier = require('./../models/sponsorTier');

/**
 * SponsorTiersRepository constructor
 *
 * @constructor
 */
function SponsorTiersRepository() {
	Repository.call(this, RepositoryHelper.SponsorTiersTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
SponsorTiersRepository.prototype = new Repository();

/**
 * Get a Sponsor Tier
 *
 * @param {String} uuid
 * @return {Promise}
 */
SponsorTiersRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new SponsorTier(data.Item));
			}
			reject(new ResourceNotFoundException('The specified sponsor tier does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Sponsor Tiers
 *
 * @return {Promise}
 */
SponsorTiersRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new SponsorTier(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get a count of all SponsorTiers
 *
 * @return {Promise}
 */
SponsorTiersRepository.prototype.getCount = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const builder = new QueryBuilder('scan');
		builder.select('COUNT');
		repository.query(builder).then(function (data) {
			console.log(data);
			resolve(data.Count);
		}).catch(function (err) {
			console.log(err);
			reject(err);
		});
	});
};

/**
 * Delete a Sponsor Tier
 *
 * @param {String} uuid
 * @return {Promise}
 */
SponsorTiersRepository.prototype.delete = function (uuid) {
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
 * Create or update a Sponsor Tier
 *
 * @param {SponsorTier} model
 */
SponsorTiersRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof SponsorTier)) {
			reject(new Error('invalid SponsorTier model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new SponsorTier(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = SponsorTiersRepository;