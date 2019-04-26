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

const Donor = require('./../models/donor');
const QueryBuilder = require('./../aws/queryBuilder');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

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
 * Get a Donor
 *
 * @param {String} uuid
 * @return {Promise}
 */
DonorsRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new Donor(data.Item));
			}
			reject(new ResourceNotFoundException('The specified donor does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Donors
 *
 * @return {Promise}
 */
DonorsRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Donor(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a Donor
 *
 * @param {String} uuid
 * @return {Promise}
 */
DonorsRepository.prototype.delete = function (uuid) {
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
 * Create or update a Donor
 *
 * @param {Donor} model
 * @return {Promise}
 */
DonorsRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Donor)) {
			reject(new Error('invalid Donor model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new Donor(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
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
	const repository = this;
	return new Promise(function (resolve, reject) {
		const builder = new QueryBuilder('scan');
		builder.filter('email', '=', email);
		repository.batchQuery(builder).then(function (data) {
			if (data.Items.length === 1) {
				resolve(new Donor(data.Items[0]));
			}
			resolve();
		}).catch(function (err) {
			reject(err)
		});
	});
};

module.exports = DonorsRepository;