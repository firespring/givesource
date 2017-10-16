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
function DonorsRepository() {
	Repository.call(this, RepositoryHelper.DonorsTable);
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
		repository.query(builder).then(function (data) {
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