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

const NonprofitRepository = require('./nonprofits');
const QueryBuilder = require('./../aws/queryBuilder');
const Report = require('./../models/report');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * NonprofitReportsRepository constructor
 *
 * @constructor
 */
function NonprofitReportsRepository() {
	Repository.call(this, RepositoryHelper.ReportsTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitReportsRepository.prototype = new Repository();

/**
 * Get a Report
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitReportsRepository.prototype.get = function (nonprofitUuid, uuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('query');
			builder.condition('uuid', '=', uuid).filter('nonprofitUuid', '=', nonprofitUuid);
			repository.query(builder).then(function (data) {
				if (data.Items.length === 1) {
					resolve(new Report(data.Items[0]));
				}
				reject(new ResourceNotFoundException('The specified report does not exist.'));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Reports for a Nonprofit
 *
 * @param {String} nonprofitUuid
 * @return {Promise}
 */
NonprofitReportsRepository.prototype.getAll = function (nonprofitUuid) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			const builder = new QueryBuilder('scan');
			builder.filter('nonprofitUuid', '=', nonprofitUuid);
			repository.query(builder).then(function (data) {
				const results = [];
				if (data.Items) {
					data.Items.forEach(function (item) {
						results.push(new Report(item));
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
 * Delete a Report
 *
 * @param {String} nonprofitUuid
 * @param {String} uuid
 * @return {Promise}
 */
NonprofitReportsRepository.prototype.delete = function (nonprofitUuid, uuid) {
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
 * Create or update a Report
 *
 * @param {String} nonprofitUuid
 * @param {Report} model
 */
NonprofitReportsRepository.prototype.save = function (nonprofitUuid, model) {
	const repository = this;
	const nonprofitRepository = new NonprofitRepository();
	return new Promise(function (resolve, reject) {
		nonprofitRepository.get(nonprofitUuid).then(function () {
			if (!(model instanceof Report)) {
				reject(new Error('invalid Report model'));
			}
			model.validate().then(function () {
				const key = {
					uuid: model.uuid
				};
				repository.put(key, model.except(['uuid'])).then(function (data) {
					resolve(new Report(data.Attributes));
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

module.exports = NonprofitReportsRepository;