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

const PageContent = require('./../models/pageContent');
const PagesRepository = require('./pages');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * PageContentsRepository constructor
 *
 * @constructor
 */
function PageContentsRepository() {
	Repository.call(this, RepositoryHelper.PageContentsTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
PageContentsRepository.prototype = new Repository();

/**
 * Get a PageContent
 *
 * @param {String} pageSlug
 * @param {String} uuid
 * @return {Promise}
 */
PageContentsRepository.prototype.get = function (pageSlug, uuid) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('pageSlug', '=', pageSlug);
			repository.query(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new PageContent(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified page content does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all PageContents for this Page
 *
 * @param {String} pageSlug
 * @return {Promise}
 */
PageContentsRepository.prototype.getAll = function (pageSlug) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
			const builder = new QueryBuilder('query');
			builder.index('pageSlugIndex').condition('pageSlug', '=', pageSlug);
			repository.query(builder).then(function (data) {
				const results = [];
				if (data.Items) {
					data.Items.forEach(function (item) {
						results.push(new PageContent(item));
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
 * Get a count of all PageContents for a Page
 *
 * @param {String} pageSlug
 * @return {Promise}
 */
PageContentsRepository.prototype.getCount = function (pageSlug) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
			const builder = new QueryBuilder('query');
			builder.index('pageSlugIndex').condition('pageSlug', '=', pageSlug).select('COUNT');
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
 * Delete a PageContent
 *
 * @param {String} pageSlug
 * @param {String} uuid
 * @return {Promise}
 */
PageContentsRepository.prototype.delete = function (pageSlug, uuid) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
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
 * Create or update a PageContent
 *
 * @param {String} pageSlug
 * @param {PageContent} model
 */
PageContentsRepository.prototype.save = function (pageSlug, model) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
			if (!(model instanceof PageContent)) {
				reject(new Error('invalid PageContent model'));
			}
			model.validate().then(function () {
				const key = {
					uuid: model.uuid
				};
				repository.put(key, model.except(['uuid'])).then(function (data) {
					resolve(new PageContent(data.Attributes));
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
 * Batch create or update PageContents
 *
 * @param {string} pageSlug
 * @param {[]} models
 * @return {Promise}
 */
PageContentsRepository.prototype.batchSave = function (pageSlug, models) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
			return repository.batchUpdate(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete PageContents
 *
 * @param {string} pageSlug
 * @param {[]} models
 * @return {Promise}
 */
PageContentsRepository.prototype.batchRemove = function (pageSlug, models) {
	const repository = this;
	const pagesRepository = new PagesRepository();
	return new Promise(function (resolve, reject) {
		pagesRepository.get(pageSlug).then(function () {
			return repository.batchDelete(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = PageContentsRepository;