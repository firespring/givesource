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
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const Setting = require('./../models/setting');

/**
 * SettingsRepository constructor
 *
 * @constructor
 */
function SettingsRepository() {
	Repository.call(this, RepositoryHelper.SettingsTable);
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