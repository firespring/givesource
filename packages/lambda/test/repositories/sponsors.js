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
const Repository = require('../../src/repositories/repository');
const Sponsor = require('../../src/models/sponsor');
const SponsorsRepository = require('../../src/repositories/sponsors');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('SponsorsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new SponsorsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of SponsorsRepository', function () {
			const repository = new SponsorsRepository();
			assert.ok(repository instanceof SponsorsRepository);
		});

		it('should set the database table', function () {
			const repository = new SponsorsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Sponsor model', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			const data = TestHelper.generate.data('sponsor', {sponsorTierUuid: sponsorTier.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, {Items: [data]});
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouResolve(repository.get(sponsorTier.uuid, data.uuid), function (model) {
				assert.ok(model instanceof Sponsor);
				assert.equal(model.uuid, data.uuid);
			});
		});

		it('should call reject on an error', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouReject(repository.get('1234', '1234'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Sponsor models', function () {
			const count = 3;
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			const data = TestHelper.generate.dataCollection('sponsor', count, {sponsorTierUuid: sponsorTier.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouResolve(repository.getAll(sponsorTier.uuid), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Sponsor);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouReject(repository.getAll('1234'));
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the Sponsor model', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouResolve(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouReject(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the Sponsor model', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			const model = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouResolve(repository.save(model.sponsorTierUuid, model), function (sponsor) {
				assert.ok(sponsor instanceof Sponsor);
				assert.equal(sponsor.uuid, model.uuid);
			});
		});

		it('should call reject for an invalid Sponsor model', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			const model = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new SponsorsRepository();
			return promiseMe.thatYouReject(repository.save(model.sponsorTierUuid, new Sponsor()));
		});

		it('should call reject on an error', function () {
			const sponsorTier = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: sponsorTier.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('sponsor');
			const repository = new SponsorsRepository();
			return promiseMe.thatYouReject(repository.save(model.sponsorTierUuid, model));
		});

	});

});