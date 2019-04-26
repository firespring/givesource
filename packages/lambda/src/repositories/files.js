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

const File = require('./../models/file');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * FilesRepository constructor
 *
 * @constructor
 */
function FilesRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.FilesTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
FilesRepository.prototype = new Repository();

/**
 * Get a File
 *
 * @param {String} uuid
 * @return {Promise}
 */
FilesRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new File(data.Item));
			}
			reject(new ResourceNotFoundException('The specified file does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Files
 *
 * @return {Promise}
 */
FilesRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new File(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get Files by uuids
 *
 * @param {[]} uuids
 * @return {Promise}
 */
FilesRepository.prototype.batchGet = function (uuids) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!uuids) {
			reject(new Error('uuids is undefined'));
		}
		const map = [];
		uuids.forEach(function (value) {
			map.push({uuid: value});
		});
		repository.batchGetKeys(map).then(function (data) {
			let results = [];
			data.forEach(function (item) {
				results.push(new File(item));
			});
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a File
 *
 * @param {String} uuid
 * @return {Promise}
 */
FilesRepository.prototype.delete = function (uuid) {
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
 * Create or update a File
 *
 * @param {File} model
 */
FilesRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof File)) {
			reject(new Error('invalid File model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new File(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = FilesRepository;