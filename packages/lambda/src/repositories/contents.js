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
const loadModels = require('./../models/index');
const Sequelize = require('sequelize');

/**
 * ContentsRepository constructor
 *
 * @constructor
 */
function ContentsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.ContentsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
ContentsRepository.prototype = new Repository();

/**
 * Look to abstract this
 *
 * @param data
 * @return {Promise}
 */
ContentsRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		const content = new models.Content();
		return new content.constructor(data, {isNewRecord: typeof data.id === 'undefined'});
	}).finally(function () {
		return allModels.sequelize.close();
	})
};

/**
 * Get a Content
 *
 * @param {String} id
 * @param {Boolean} returnNull
 * @return {Promise}
 */
ContentsRepository.prototype.get = function (id, returnNull = false) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.findOne({
				where: {
					id: id
				}
			}).then(function (content) {
				if (content instanceof allModels.Content || returnNull) {
					resolve(content);
				}
				reject(new ResourceNotFoundException('The specified content does not exist.'));
			});
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get all contents by parentId
 *
 * @param {String} parentId
 * @return {Promise}
 */
ContentsRepository.prototype.getByParentId = function (parentId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.findAll({
				where: {
					parentId: parentId
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
 * Get all contents by key
 *
 * @param {String} key
 * @return {Promise}
 */
ContentsRepository.prototype.getAllByKey = function (key) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.findAll({
				where: {
					key: key
				}
			}).then(function (results) {
				resolve(results);
			});
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get Contents by keys
 *
 * @param {Array} keys
 * @return {Promise}
 */
ContentsRepository.prototype.batchGet = function (keys) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (keys.length) {
				return allModels.Content.findAll({
					where: {
						key: {
							[Sequelize.Op.or]: keys
						}
					}
				});
			} else {
				return allModels.Content.findAll();
			}
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
 * Delete an array of Content models
 *
 * @param {Array} models
 * @returns {Promise<any>}
 */
ContentsRepository.prototype.batchDelete = function (models) {
	let allModels;
	const ids = models.map(function (model) {
		return model.id;
	});
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (loadedModels) {
			allModels = loadedModels;
		}).then(function () {
			if (ids.length > 0) {
				return allModels.Content.destroy({
					where: {
						id: {
							[Sequelize.Op.or]: ids
						}
					}
				})
			}
			resolve();
		}).then(function (stuff) {
			resolve(stuff);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get a count by parentUuid
 *
 * @param {String} key
 * @return {Promise}
 */
ContentsRepository.prototype.getCountByKey = function (key) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.findAndCountAll({where: {key: key}});
		}).then(function (data) {
			resolve(data)
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Delete a Content
 *
 * @param {String} contentId
 * @return {Promise}
 */
ContentsRepository.prototype.delete = function (contentId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.destroy({where: {id: contentId}});
		}).then(function () {
			resolve()
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Batch delete Contents by parentId
 *
 * @param {String} parentId
 * @return {Promise}
 */
ContentsRepository.prototype.batchDeleteByParentId = function (parentId) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.destroy({where: {parentId: parentId}});
		}).then(function () {
			resolve()
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Batch delete Contents by key
 *
 * @param {String} key
 * @return {Promise}
 */
ContentsRepository.prototype.batchDeleteByKey = function (key) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Content.destroy({where: {key: key}});
		}).then(function () {
			resolve()
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Create or update a Content
 *
 * @param {Promise} model
 */
ContentsRepository.prototype.save = function (model) {
	let allModels;
	const repository = this;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			if (!(model instanceof allModels.Content)) {
				reject(new Error('invalid Content model'));
			}
			return repository.upsert(model, {});
		}).then(function (content) {
			resolve(content);
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
ContentsRepository.prototype.upsert = function (model, data) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (typeof model === 'undefined') {
				const content = new allModels.Content();
				model = new content.constructor({}, {isNewRecord: typeof data.id === 'undefined'});
			}
			return allModels.Content.upsert({
				'id': model.id,
				'key': typeof data.key !== "undefined" ? data.key : model.key,
				'value': typeof data.value !== "undefined" ? data.value : model.value,
				'sortOrder': typeof data.sortOrder !== "undefined" ? data.sortOrder : model.sortOrder,
				'type': typeof data.type !== "undefined" ? data.type : model.type,
				'parentId': typeof data.parentId !== "undefined" ? data.parentId : model.parentId,
			});
		}).then(function (content) {
			resolve(content);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

module.exports = ContentsRepository;