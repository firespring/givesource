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

const assert = require('assert');
const AWS = require('aws-sdk-mock');
const Donor = require('../../src/models/donor');
const DonorsRepository = require('../../src/repositories/donors');
const Repository = require('../../src/repositories/repository');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('DonorsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new DonorsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of DonorsRepository', function () {
			const repository = new DonorsRepository();
			assert.ok(repository instanceof DonorsRepository);
		});

		it('should set the database table', function () {
			const repository = new DonorsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Donor model', function () {
			const data = TestHelper.generate.data('donor');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouResolve(repository.get(data.email), function (model) {
				assert.ok(model instanceof Donor);
				assert.equal(model.email, data.email);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouReject(repository.get('woody@firespring.com'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Donor models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('donor', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Donor);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the Donor model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouReject(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the Donor model', function () {
			const model = TestHelper.generate.model('donor');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouResolve(repository.save(model), function (donor) {
				assert.ok(donor instanceof Donor);
				assert.equal(donor.email, model.email);
			});
		});

		it('should call reject for an invalid Donor model', function () {
			const model = TestHelper.generate.model('donor');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouReject(repository.save(new Donor()));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('donor');
			const repository = new DonorsRepository();
			return promiseMe.thatYouReject(repository.save(model));
		});

	});

	describe('#queryEmail()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Donor model', function () {
			const donor = TestHelper.generate.model('donor');
			const items = TestHelper.generate.dataCollection('donor', 1, {email: donor.email});
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Items: items,
					Count: 1
				});
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouResolve(repository.queryEmail(donor.email), function (model) {
				assert(model instanceof Donor);
				assert.equal(model.email, donor.email);
			});
		});

		it('should call reject on an error', function () {
			const donor = TestHelper.generate.model('donor');
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new DonorsRepository();
			return promiseMe.thatYouReject(repository.queryEmail(donor.email));
		});

	});

});