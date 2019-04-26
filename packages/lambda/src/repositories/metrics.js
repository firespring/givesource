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

const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const Metric = require('./../models/metric');

/**
 * MetricsRepository constructor
 *
 * @constructor
 */
function MetricsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.MetricsTable;
	}
	Repository.call(this, options);
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