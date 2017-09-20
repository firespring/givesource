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

const PaymentTransaction = require('../models/paymentTransaction');
const Repository = require('../repositories/repository');
const RepositoryHelper = require('../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * PaymentTransactionsRepository constructor
 *
 * @constructor
 */
function PaymentTransactionsRepository() {
	Repository.call(this, RepositoryHelper.PaymentTransactionsTable);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
PaymentTransactionsRepository.prototype = new Repository();

/**
 * Get a PaymentTransaction
 *
 * @param {String} uuid
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new PaymentTransaction(data.Item));
			}
			reject(new ResourceNotFoundException('The specified payment transaction does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all PaymentTransactions
 *
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new PaymentTransaction(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a PaymentTransaction
 *
 * @param {String} uuid
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.delete = function (uuid) {
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
 * Create or update a PaymentTransaction
 *
 * @param {PaymentTransaction} model
 */
PaymentTransactionsRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof PaymentTransaction)) {
			reject(new Error('invalid PaymentTransaction model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new PaymentTransaction(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = PaymentTransactionsRepository;