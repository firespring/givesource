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

const NonprofitRepository = require('./nonprofits');
const NonprofitSlide = require('../models/nonprofitSlide');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * NonprofitSlidesRepository constructor
 *
 * @constructor
 */
function NonprofitSlidesRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.NonprofitSlidesTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitSlidesRepository.prototype = new Repository();

/**
 * Get a NonprofitSlide
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.get = function (nonprofitUuid, uuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('nonprofitUuid', '=', nonprofitUuid);
			repository.batchQuery(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new NonprofitSlide(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified slide does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Slides for a Nonprofit
 *
 * @param {String} nonprofitUuid
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.getAll = function (nonprofitUuid) {
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
						results.push(new NonprofitSlide(item));
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
 * Get a count of all Slides for a Nonprofit
 *
 * @param {String} nonprofitUuid
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.getCount = function (nonprofitUuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('scan');
			builder.filter('nonprofitUuid', '=', nonprofitUuid).select('COUNT');
			repository.batchQuery(builder).then(function (data) {
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
 * Delete a NonprofitSlide
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.delete = function (nonprofitUuid, uuid) {
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
 * Create or update a NonprofitSlide
 *
 * @param {String} nonprofitUuid
 * @param {NonprofitSlide} model
 */
NonprofitSlidesRepository.prototype.save = function (nonprofitUuid, model) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			if (!(model instanceof NonprofitSlide)) {
				reject(new Error('invalid NonprofitSlide model'));
			}
			model.validate().then(function () {
				const key = {
					uuid: model.uuid
				};
				repository.put(key, model.except(['uuid'])).then(function (data) {
					resolve(new NonprofitSlide(data.Attributes));
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
 * Batch create or update Slides
 *
 * @param {string} nonprofitUuid
 * @param {[]} models
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.batchSave = function (nonprofitUuid, models) {
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

module.exports = NonprofitSlidesRepository;