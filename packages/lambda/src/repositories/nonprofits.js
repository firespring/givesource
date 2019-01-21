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

const _ = require('lodash');
const Nonprofit = require('./../models/nonprofit');
const NonprofitHelper = require('./../helpers/nonprofit');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./../repositories/repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * NonprofitsRepository constructor
 *
 * @constructor
 */
function NonprofitsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.NonprofitsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base repository
 *
 * @type {Repository}
 */
NonprofitsRepository.prototype = new Repository();

/**
 * Get a Nonprofit
 *
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitsRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new Nonprofit(data.Item));
			}
			reject(new ResourceNotFoundException('The specified nonprofit does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get a Nonprofit by slug
 *
 * @param {String} slug
 * @return {Promise}
 */
NonprofitsRepository.prototype.getBySlug = function (slug) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const builder = new QueryBuilder('query');
		builder.index('slugIndex').condition('slug', '=', slug);
		repository.batchQuery(builder).then(function (results) {
			if (results.hasOwnProperty('Count') && results.hasOwnProperty('Items') && results.Count === 1) {
				resolve(new Nonprofit(results.Items[0]));
			}
			reject(new ResourceNotFoundException('The specified nonprofit does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Nonprofits
 *
 * @return {Promise}
 */
NonprofitsRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Nonprofit(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Search nonprofits
 *
 * @param {[]} keys
 * @param {String} search
 * @param {{}} [filters]
 * @return {Promise}
 */
NonprofitsRepository.prototype.search = function (keys, search, filters) {
	const repository = this;
	search = search.trim();
	return new Promise(function (resolve, reject) {
		const params = {
			FilterExpression: '',
			ExpressionAttributeNames: {},
			ExpressionAttributeValues: {},
		};

		keys.forEach(function (key) {
			const query = isNaN(search) ? `contains(#${key}, :${key})` : `#${key} = :${key}`;
			params.FilterExpression = params.FilterExpression ? params.FilterExpression + ' OR ' + query : query;
			params.ExpressionAttributeNames[`#${key}`] = key;
			params.ExpressionAttributeValues[`:${key}`] = isNaN(search) ? search : parseInt(search);
		});

		if (Object.keys(filters).length) {
			params.FilterExpression = `(${params.FilterExpression})`;
			Object.keys(filters).forEach(function (key) {
				let filterConditional = '=';
				let filterValue = filters[key];
				if (_.isPlainObject(filterValue)) {
					filterConditional = filterValue.conditional;
					filterValue = filterValue.value;
				} else if (isNaN(filterValue)) {
					filterConditional = 'contains';
				} else {
					filterValue = parseInt(filterValue);
				}

				let query = `#${key} ${filterConditional} :${key}`;
				if (filterConditional === '!=' || filterConditional.toLowerCase() === 'not') {
					query = `NOT #${key} = :${key}`;
				} else if (filterConditional === 'contains') {
					query = `contains(#${key}, :${key})`;
				}
				params.FilterExpression = params.FilterExpression + ' AND ' + query;
				params.ExpressionAttributeNames[`#${key}`] = key;
				params.ExpressionAttributeValues[`:${key}`] = filterValue;
			});
		}

		repository.batchScan(params).then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Nonprofit(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a Nonprofit
 *
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitsRepository.prototype.delete = function (uuid) {
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
 * Create or update a Nonprofit
 *
 * @param {Nonprofit} model
 */
NonprofitsRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Nonprofit)) {
			reject(new Error('invalid Nonprofit model'));
		}
		model.beforeSave();
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new Nonprofit(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Generate a unique slug for this nonprofit
 *
 * @param {Nonprofit} model
 * @param {String} [slug]
 * @param {int} [attemptCount]
 * @param {int} [maxTries]
 * @return {Promise}
 */
NonprofitsRepository.prototype.generateUniqueSlug = function (model, slug, attemptCount, maxTries) {
	const repository = this;
	slug = slug || null;
	attemptCount = (attemptCount > 0) ? attemptCount : 0;
	maxTries = (maxTries > 0) ? maxTries : 3;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Nonprofit)) {
			reject(new Error('invalid Nonprofit model'));
		}

		if (attemptCount > maxTries) {
			reject(new Error('unable to generate slug'));
		}

		if (slug && attemptCount === 0) {
			model.slug = slug;
		} else if (slug && attemptCount > 0) {
			model.slug = `${slug}-${attemptCount}`;
		} else {
			model.slug = NonprofitHelper.generateSlug(model.legalName);
			slug = model.slug;
		}

		repository.validateSlugUniqueness(model).then(function () {
			resolve();
		}).catch(function () {
			resolve(repository.generateUniqueSlug(model, slug, attemptCount + 1, maxTries));
		});
	});
};

/**
 * Validates the uniqueness of a nonprofit's slug
 *
 * @param {Nonprofit} model
 * @return {Promise}
 */
NonprofitsRepository.prototype.validateSlugUniqueness = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Nonprofit)) {
			reject(new Error('invalid Nonprofit model'));
		}
		const builder = new QueryBuilder('query');
		builder.index('slugIndex').condition('slug', '=', model.slug).filter('uuid', '!=', model.uuid);
		repository.batchQuery(builder).then(function (results) {
			if (results.hasOwnProperty('Count') && results.hasOwnProperty('Items') && results.Count > 0) {
				results.Items.forEach(function (data) {
					if (data.uuid !== model.uuid) {
						reject(new Error('slug is not unique'));
					}
				});
			}
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = NonprofitsRepository;