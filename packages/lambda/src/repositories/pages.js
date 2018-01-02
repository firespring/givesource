/*
 * Copyright (C) 2018  Firespring
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

const Page = require('./../models/page');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * PagesRepository constructor
 *
 * @constructor
 */
function PagesRepository() {
	Repository.call(this, RepositoryHelper.SponsorTiersTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
PagesRepository.prototype = new Repository();

/**
 * Get a Page
 *
 * @param {String} slug
 * @return {Promise}
 */
PagesRepository.prototype.get = function (slug) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('slug', slug).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new Page(data.Item));
			}
			reject(new ResourceNotFoundException('The specified page does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Pages
 *
 * @return {Promise}
 */
PagesRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Page(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get a count of all Pages
 *
 * @return {Promise}
 */
PagesRepository.prototype.getCount = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const builder = new QueryBuilder('scan');
		builder.select('COUNT');
		repository.query(builder).then(function (data) {
			resolve(data.Count);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Create or update a Page
 *
 * @param {Page} model
 */
PagesRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Page)) {
			reject(new Error('invalid Page model'));
		}
		model.validate().then(function () {
			const key = {
				slug: model.slug
			};
			repository.put(key, model.except(['slug'])).then(function (data) {
				resolve(new Page(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = PagesRepository;