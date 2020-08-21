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

const assert = require('assert');
const AWS = require('aws-sdk-mock');
const Donation = require('../../src/dynamo-models/donation');
const DonationsRepository = require('../../src/repositories/donations');
const Repository = require('../../src/repositories/repository');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('DonationsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new DonationsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of DonationsRepository', function () {
			const repository = new DonationsRepository();
			assert.ok(repository instanceof DonationsRepository);
		});

		it('should set the database table', function () {
			const repository = new DonationsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Donation model', function () {
			const data = TestHelper.generate.data('donation');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouResolve(repository.get(data.uuid), function (model) {
				assert.ok(model instanceof Donation);
				assert.equal(model.uuid, data.uuid);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouReject(repository.get('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Donation models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('donation', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Donation);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the Donation model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouReject(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the Donation model', function () {
			const model = TestHelper.generate.model('donation');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouResolve(repository.save(model), function (donation) {
				assert.ok(donation instanceof Donation);
				assert.equal(donation.uuid, model.uuid);
			});
		});

		it('should call reject for an invalid Donation model', function () {
			const model = TestHelper.generate.model('donation');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new DonationsRepository();
			return promiseMe.thatYouReject(repository.save(new Donation()));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('donation');
			const repository = new DonationsRepository();
			return promiseMe.thatYouReject(repository.save(model));
		});

	});

});