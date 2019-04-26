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

const Donation = require('./../models/donation');
const NonprofitRepository = require('./nonprofits');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * NonprofitDonationsRepository constructor
 *
 * @constructor
 */
function NonprofitDonationsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.DonationsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitDonationsRepository.prototype = new Repository();

/**
 * Get a Donation
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitDonationsRepository.prototype.get = function (nonprofitUuid, uuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('nonprofitUuid', '=', nonprofitUuid);
			repository.batchQuery(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new Donation(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified donation does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Donations for a Nonprofit
 *
 * @param {String} nonprofitUuid
 * @return {Promise}
 */
NonprofitDonationsRepository.prototype.getAll = function (nonprofitUuid) {
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
						results.push(new Donation(item));
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
 * Delete a Donation
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitDonationsRepository.prototype.delete = function (nonprofitUuid, uuid) {
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
NonprofitDonationsRepository.prototype.save = function (nonprofitUuid, model) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			if (!(model instanceof Donation)) {
				reject(new Error('invalid Donation model'));
			}
			model.validate().then(function () {
				const key = {
					uuid: model.uuid
				};
				repository.put(key, model.except(['uuid'])).then(function (data) {
					resolve(new Donation(data.Attributes));
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

module.exports = NonprofitDonationsRepository;