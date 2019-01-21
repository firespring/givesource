/*
 * Copyright 2018 Firespring, Inc.
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

const PaymentTransaction = require('./../models/paymentTransaction');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * PaymentTransactionsRepository constructor
 *
 * @constructor
 */
function PaymentTransactionsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.PaymentTransactionsTable;
	}
	Repository.call(this, options);
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