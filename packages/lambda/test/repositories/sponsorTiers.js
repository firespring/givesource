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
const Repository = require('../../src/repositories/repository');
const SponsorTier = require('../../src/models/sponsorTier');
const SponsorTiersRepository = require('../../src/repositories/sponsorTiers');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('SponsorTiersRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new SponsorTiersRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of SponsorTiersRepository', function () {
			const repository = new SponsorTiersRepository();
			assert.ok(repository instanceof SponsorTiersRepository);
		});

		it('should set the database table', function () {
			const repository = new SponsorTiersRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a SponsorTier model', function () {
			const data = TestHelper.generate.data('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouResolve(repository.get(data.uuid), function (model) {
				assert.ok(model instanceof SponsorTier);
				assert.equal(model.uuid, data.uuid);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouReject(repository.get('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all SponsorTier models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('sponsorTier', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof SponsorTier);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the SponsorTier model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouReject(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the SponsorTier model', function () {
			const model = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouResolve(repository.save(model), function (sponsorTier) {
				assert.ok(sponsorTier instanceof SponsorTier);
				assert.equal(sponsorTier.uuid, model.uuid);
			});
		});

		it('should call reject for an invalid Report model', function () {
			const model = TestHelper.generate.model('sponsorTier');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouReject(repository.save(new SponsorTier()));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('sponsorTier');
			const repository = new SponsorTiersRepository();
			return promiseMe.thatYouReject(repository.save(model));
		});

	});

});