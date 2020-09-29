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

const _ = require('lodash');
const Nonprofit = require('./../dynamo-models/nonprofit');
const NonprofitHelper = require('./../helpers/nonprofit');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./../repositories/repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const loadModels = require('../models/index');
const Sequelize = require('sequelize');

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
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
NonprofitsRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		const nonprofit = new models.Nonprofit();
		return new nonprofit.constructor(data, {isNewRecord: typeof data.id === 'undefined'});
	}).finally(function () {
		return allModels.sequelize.close();
	});
};

/**
 * Get a Nonprofit
 *
 * @param {String} id
 * @return {Promise}
 */
NonprofitsRepository.prototype.get = function (id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Nonprofit.findOne({
				where: {
					id: id
				},
				include: [
					{
						model: allModels.NonprofitDonationTier
					},
					{
						model: allModels.NonprofitSlide
					},

				]
			});
		}).then(function (nonprofit) {
			if (nonprofit instanceof allModels.Nonprofit) {
				resolve(nonprofit);
			}
			reject(new ResourceNotFoundException('The specified nonprofit does not exist.'));
		});
		}).catch(function (err) {
			reject(err);
	}).finally(function () {
		return allModels.sequelize.close();
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
 * Query Nonprofits
 *
 * @param {{}} [params]
 */
NonprofitsRepository.prototype.queryNonprofits = function (params) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Nonprofit.findAndCountAll(params);
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
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			if (model === null) {
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
		}).finally(function () {
			return allModels.sequelize.close();
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
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (!model) {
				reject(new Error('invalid Nonprofit model'));
			}
			return allModels.Nonprofit.count({
				where: {
					slug: model.slug,
					id: {
						[Sequelize.Op.ne]: model.id
					}
				}
			});
		}).then(function (count) {
			if (count > 0) {
				reject(new Error('slug is not unique'));
			}
			resolve(true);
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
NonprofitsRepository.prototype.upsert = function (model, data) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (typeof model === 'undefined') {
				const content = new allModels.Nonprofit();
				model = new content.constructor({}, {isNewRecord: typeof data.id === 'undefined'});
			}
			return allModels.Nonprofit.upsert({
				'id': model.get('id'),
				'address1': typeof data.address1 !== "undefined" ? data.address1 : model.address1,
				'address2': typeof data.address2 !== "undefined" ? data.address2 : model.address2,
				'category1': typeof data.category1 !== "undefined" ? data.category1 : model.category1,
				'category2': typeof data.category2 !== "undefined" ? data.category2 : model.category2,
				'category3': typeof data.category3 !== "undefined" ? data.category3 : model.category3,
				'city': typeof data.city !== "undefined" ? data.city : model.city,
				'email': typeof data.email !== "undefined" ? data.email : model.email,
				'firstName': typeof data.firstName !== "undefined" ? data.firstName : model.firstName,
				'lastName': typeof data.lastName !== "undefined" ? data.lastName : model.lastName,
				'phone': typeof data.phone !== "undefined" ? data.phone : model.phone,
				'state': typeof data.state !== "undefined" ? data.state : model.state,
				'zip': typeof data.zip !== "undefined" ? data.zip : model.zip,
				'legalName': typeof data.legalName !== "undefined" ? data.legalName : model.legalName,
				'legalNameSearch': typeof data.legalNameSearch !== "undefined" ? data.legalNameSearch : model.legalNameSearch,
				'logoFileId': typeof data.logoFileId !== "undefined" ? data.logoFileId : model.logoFileId,
				'longDescription': typeof data.longDescription !== "undefined" ? data.longDescription : model.longDescription,
				'shortDescription': typeof data.shortDescription !== "undefined" ? data.shortDescription : model.shortDescription,
				'slug': typeof data.slug !== "undefined" ? data.slug : model.slug,
				'socialSharingDescription': typeof data.socialSharingDescription !== "undefined" ? data.socialSharingDescription : model.socialSharingDescription,
				'socialSharingFileId': typeof data.socialSharingFileId !== "undefined" ? data.socialSharingFileId : model.socialSharingFileId,
				'status': typeof data.status !== "undefined" ? data.status : model.status,
				'taxId': typeof data.taxId !== "undefined" ? data.taxId : model.taxId,
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

module.exports = NonprofitsRepository;