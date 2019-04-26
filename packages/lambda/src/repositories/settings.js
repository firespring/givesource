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
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const Setting = require('./../models/setting');

/**
 * SettingsRepository constructor
 *
 * @constructor
 */
function SettingsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.SettingsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
SettingsRepository.prototype = new Repository();

/**
 * Get a Setting
 *
 * @param {String} key
 * @return {Promise}
 */
SettingsRepository.prototype.get = function (key) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('key', key).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new Setting(data.Item));
			}
			reject(new ResourceNotFoundException('The specified setting does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Settings
 *
 * @return {Promise}
 */
SettingsRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Setting(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get Settings by keys
 *
 * @param {[]} keys
 * @return {Promise}
 */
SettingsRepository.prototype.batchGet = function (keys) {
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
				results.push(new Setting(item));
			});
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a Setting
 *
 * @param {String} key
 * @return {Promise}
 */
SettingsRepository.prototype.delete = function (key) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.deleteByKey('key', key).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete Settings
 *
 * @param {[]} models
 * @return {Promise}
 */
SettingsRepository.prototype.batchDeleteByKey = function (models) {
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

/**
 * Create or update a Setting
 *
 * @param {Setting} model
 */
SettingsRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Setting)) {
			reject(new Error('invalid Setting model'));
		}
		model.validate().then(function () {
			const key = {
				key: model.key
			};
			repository.put(key, model.except(['key'])).then(function (data) {
				resolve(new Setting(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = SettingsRepository;