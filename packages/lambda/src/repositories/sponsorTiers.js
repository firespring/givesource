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
const SponsorTier = require('./../dynamo-models/sponsorTier');

/**
 * SponsorTiersRepository constructor
 *
 * @constructor
 */
function SponsorTiersRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.SponsorTiersTable;
	}
	Repository.call(this, options);
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
		repository.batchQuery(builder).then(function (data) {
			resolve(data.Count);
		}).catch(function (err) {
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