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

const assert = require('assert');
const AWS = require('aws-sdk-mock');
const PaymentTransaction = require('../../src/models/paymentTransaction');
const PaymentTransactionsRepository = require('../../src/repositories/paymentTransactions');
const Repository = require('../../src/repositories/repository');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('PaymentTransactionsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new PaymentTransactionsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of PaymentTransactionsRepository', function () {
			const repository = new PaymentTransactionsRepository();
			assert.ok(repository instanceof PaymentTransactionsRepository);
		});

		it('should set the database table', function () {
			const repository = new PaymentTransactionsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a PaymentTransaction model', function () {
			const data = TestHelper.generate.data('paymentTransaction');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouResolve(repository.get(data.uuid), function (model) {
				assert.ok(model instanceof PaymentTransaction);
				assert.equal(model.uuid, data.uuid);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouReject(repository.get('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all PaymentTransaction models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('paymentTransaction', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof PaymentTransaction);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the PaymentTransaction model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouReject(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the PaymentTransaction model', function () {
			const model = TestHelper.generate.model('paymentTransaction');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouResolve(repository.save(model), function (paymentTransaction) {
				assert.ok(paymentTransaction instanceof PaymentTransaction);
				assert.equal(paymentTransaction.uuid, model.uuid);
			});
		});

		it('should call reject for an invalid PaymentTransaction model', function () {
			const model = TestHelper.generate.model('paymentTransaction');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouReject(repository.save(new PaymentTransaction()));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('paymentTransaction');
			const repository = new PaymentTransactionsRepository();
			return promiseMe.thatYouReject(repository.save(model));
		});

	});

});