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

const File = require('./../dynamo-models/file');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const loadModels = require('./../models/index');
const Sequelize = require('sequelize');

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
 * Look to abstract this
 *
 * @param data
 * @return {Promise}
 */
FilesRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		return new models.File(data);
	}).finally(function () {
		return allModels.sequelize.close();
	})
};

/**
 * Get a File
 *
 * @param {String} id
 * @return {Promise}
 */
FilesRepository.prototype.get = function (id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.File.findOne({
				where: {
					id: id
				}
			}).then(function (setting) {
				if (setting instanceof allModels.File) {
					resolve(setting);
				}
				reject(new ResourceNotFoundException('The specified file does not exist.'));
			});
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
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
 * Get Files by id
 *
 * @param {[]} fileIds
 * @return {Promise}
 */
FilesRepository.prototype.batchGet = function (fileIds) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.File.findAll({
				where: {
					id: {
						[Sequelize.Op.or]: fileIds
					}
				}
			});
		}).then(function (results) {
			resolve(results);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
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
	let allModels;
	const repository = this;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			if (!(model instanceof allModels.File)) {
				reject(new Error('invalid File model'));
			}
			return repository.upsert(model, {});
		}).then(function (file) {
			resolve(file);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Insert or update the model
 *
 * @param model
 * @param data
 * @return {Promise<any>}
 */
FilesRepository.prototype.upsert = function (model, data) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.File.upsert({
				'id': model.get('id'),
				'path': typeof data.path !== "undefined" ? data.path : model.get('path'),
				'filename': typeof data.filename !== "undefined" ? data.filename : model.get('filename'),
			});
		}).then(function (file) {
			resolve(file);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

module.exports = FilesRepository;