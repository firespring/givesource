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
const QueryBuilder = require('./../../src/aws/queryBuilder');
const Repository = require('./../repositories/repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const SlugHelper = require('./../helpers/slug');

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
 * Query Nonprofit Slug
 *
 * @param {Nonprofit} model
 * @return {Promise}
 */
NonprofitsRepository.prototype.querySlug = function (model) {
	const repository = this;
	const builder = new QueryBuilder('query');
	builder.index('slugIndex');

	return new Promise(function (resolve, reject) {
		if (!(model instanceof Nonprofit)) {
			reject(new Error('invalid Nonprofit index'));
		}
		model.validate().then(function () {
			repository.query(builder).then(function (data) {
				for (let slipperySlug in data) {
					if (model.attributes.slug === data[slipperySlug].slug || model.attributes.slug === '' || model.attributes.slug === null || model.attributes.slug === 'undefined') {
						SlugHelper.generateSlug(model, 0, data, function (slug) {
							model.slug = slug;
						});
					}
				}
				resolve(new Nonprofit(model));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});

};

module.exports = NonprofitsRepository;