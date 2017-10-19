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
function NonprofitsRepository() {
	Repository.call(this, RepositoryHelper.NonprofitsTable);
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
		repository.query(builder).then(function (results) {
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