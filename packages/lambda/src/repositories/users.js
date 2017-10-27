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

const User = require('./../models/user');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * UsersRepository constructor
 *
 * @constructor
 */
function UsersRepository() {
	Repository.call(this, RepositoryHelper.UsersTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
UsersRepository.prototype = new Repository();

/**
 * Get a User
 *
 * @param {String} uuid
 * @return {Promise}
 */
UsersRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new User(data.Item));
			}
			reject(new ResourceNotFoundException('The specified user does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Users
 *
 * @return {Promise}
 */
UsersRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new User(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all admin Users
 *
 * @return {Promise}
 */
UsersRepository.prototype.getAdminUsers = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const params = {
			FilterExpression: 'attribute_not_exists(nonprofitUuid)'
		};
		repository.batchScan(params).then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new User(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a User
 *
 * @param {String} uuid
 * @return {Promise}
 */
UsersRepository.prototype.delete = function (uuid) {
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
 * Create or update a User
 *
 * @param {User} model
 */
UsersRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof User)) {
			reject(new Error('invalid User model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new User(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = UsersRepository;