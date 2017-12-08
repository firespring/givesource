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

const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const Metric = require('./../models/metric');

/**
 * MetricsRepository constructor
 *
 * @constructor
 */
function MetricsRepository() {
	Repository.call(this, RepositoryHelper.MetricsTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
MetricsRepository.prototype = new Repository();

/**
 * Get all Metrics
 *
 * @return {Promise}
 */
MetricsRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Metric(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get Metrics by keys
 *
 * @param {[]} keys
 * @return {Promise}
 */
MetricsRepository.prototype.batchGet = function (keys) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!keys) {
			reject(new Error('keys is undefined'));
		}
		const map = [];
		keys.forEach(function (value) {
			map.push({key: value});
		});
		repository.batchGetKeys(map).then(function (data) {
			let results = [];
			data.forEach(function (item) {
				results.push(new Metric(item));
			});
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete Metrics
 *
 * @param {[]} models
 * @return {Promise}
 */
MetricsRepository.prototype.batchDeleteByKey = function (models) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const requestItems = [];
		models = models || [];
		models.forEach(function (model) {
			requestItems.push({
				DeleteRequest: {
					Key: {
						key: model.key
					}
				}
			});
		});
		repository.batchWrite(requestItems, 3).then(function (data) {
			resolve(data);
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = MetricsRepository;