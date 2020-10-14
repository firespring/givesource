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

const Donor = require('./../dynamo-models/donor');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const loadModels = require('../models/index');
const Sequelize = require('sequelize');

/**
 * DonorsRepository constructor
 *
 * @constructor
 */
function DonorsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.DonorsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
DonorsRepository.prototype = new Repository();

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
DonorsRepository.prototype.populate = function (data) {
	let allModels;
	return loadModels().then(function (models) {
		allModels = models;
		const donor = new models.Donor();
		return new donor.constructor(data, {isNewRecord: typeof data.id === 'undefined'});
	}).finally(function () {
		return allModels.sequelize.close();
	});
};

/**
 * Get a Donor
 *
 * @param {String} id
 * @return {Promise}
 */
DonorsRepository.prototype.get = function (id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Donor.findOne({
				where: {
					id: id
				}
			});
		}).then(function (donor) {
			if (donor instanceof allModels.Donor) {
				resolve(donor);
			}
			reject(new ResourceNotFoundException('The specified donor does not exist.'));
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * Get all Donors
 *
 * @return {Promise}
 */
DonorsRepository.prototype.getAll = function () {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Donor.findAll();
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
 * Delete a Donor
 *
 * @param {String} id
 * @return {Promise}
 */
DonorsRepository.prototype.delete = function (id) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Donor.destroy({
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
 * Create or update a Donor
 *
 * @param {Donor} model
 * @return {Promise}
 */
DonorsRepository.prototype.save = function (model) {
	let allModels;
	const repository = this;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
			return repository.get(model.id);
		}).then(function () {
			return repository.upsert(model, {});
		}).then(function (donor) {
			resolve(donor);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

/**
 * See if email is already being used
 *
 * @param {string} email
 * @return {Promise}
 */
DonorsRepository.prototype.queryEmail = function (email) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			return allModels.Donor.findOne({
				where: {
					email: email
				}
			});
		}).then(function (donor) {
			if (donor instanceof allModels.Donor) {
				resolve(donor);
			}
			resolve();
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
DonorsRepository.prototype.upsert = function (model, data) {
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			if (typeof model === 'undefined') {
				const donor = new allModels.Donor();
				model = new donor.constructor({}, {isNewRecord: typeof data.id === 'undefined'});
			}
			return allModels.Donor.upsert({
				'id': model.id,
				'amountForNonprofit': typeof data.amountForNonprofit !== "undefined" ? data.amountForNonprofit : model.amountForNonprofit,
				'address1': typeof data.address1 !== "undefined" ? data.address1 : model.address1,
				'address2': typeof data.address2 !== "undefined" ? data.address2 : model.address2,
				'city': typeof data.city !== "undefined" ? data.city : model.city,
				'email': typeof data.email !== "undefined" ? data.email : model.email,
				'firstName': typeof data.firstName !== "undefined" ? data.firstName : model.firstName,
				'lastName': typeof data.lastName !== "undefined" ? data.lastName : model.lastName,
				'phone': typeof data.phone !== "undefined" ? data.phone : model.phone,
				'state': typeof data.state !== "undefined" ? data.state : model.state,
				'zip': typeof data.zip !== "undefined" ? data.zip : model.zip,
			});
		}).then(function (donor) {
			resolve(donor[0]);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
		});
	});
};

module.exports = DonorsRepository;