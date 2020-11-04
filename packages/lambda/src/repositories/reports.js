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

const Report = require('./../dynamo-models/report');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const loadModels = require('../models/index');
const Sequelize = require('sequelize');

/**
 * ReportsRepository constructor
 *
 * @constructor
 */
function ReportsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.ReportsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
ReportsRepository.prototype = new Repository();

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
ReportsRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		const report = new models.Report();
		return new report.constructor(data, {isNewRecord: typeof data.id === 'undefined'});
	}).finally(function () {
		return allModels.sequelize.close();
	});
};

/**
 * Get a Report
 *
 * @param {String} id
 * @return {Promise}
 */
ReportsRepository.prototype.get = function (id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Report.findOne({
				where: {
					id: id
				},
				include: [
					{model: allModels.Nonprofit},
					{model: allModels.File}
				]
			});
		}).then(function (report) {
			if (report instanceof allModels.Report) {
				resolve(report);
			}
			reject(new ResourceNotFoundException('The specified report does not exist.'));
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get all Reports
 *
 * @return {Promise}
 */
ReportsRepository.prototype.getAll = function () {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Report.findAll();
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
 * Delete a Report
 *
 * @param {String} id
 * @return {Promise}
 */
ReportsRepository.prototype.delete = function (id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Report.destroy({
				where:
					{
						id: id
					}
			});
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
 * Create or update a Report
 *
 * @param {Report} model
 */
ReportsRepository.prototype.save = function (model) {
	let allModels;
	const repository = this;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			return repository.get(model.id);
		}).then(function () {
			return repository.upsert(model, {});
		}).then(function (report) {
			resolve(report);
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
 * @param {Object} model
 * @param {Object} data
 * @return {Promise<any>}
 */
ReportsRepository.prototype.upsert = function (model, data) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (typeof model === 'undefined') {
				const report = new allModels.Report();
				model = new report.constructor({}, {isNewRecord: typeof data.id === 'undefined'});
			}
			return allModels.Report.upsert({
				'id': model.id,
				'fileId': typeof data.fileId !== "undefined" ? data.fileId : model.fileId,
				'nonprofitId': typeof data.nonprofitId !== "undefined" ? data.nonprofitId : model.nonprofitId,
				'status': typeof data.status !== "undefined" ? data.status : model.status,
				'type': typeof data.type !== "undefined" ? data.type : model.type,
			});
		}).then(function (report) {
			resolve(report[0]);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

module.exports = ReportsRepository;