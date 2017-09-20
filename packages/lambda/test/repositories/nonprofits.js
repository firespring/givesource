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
const Nonprofit = require('../../src/models/nonprofit');
const NonprofitsRepository = require('../../src/repositories/nonprofits');
const Repository = require('../../src/repositories/repository');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('NonprofitsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new NonprofitsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of NonprofitsRepository', function () {
			const repository = new NonprofitsRepository();
			assert.ok(repository instanceof NonprofitsRepository);
		});

		it('should set the database table', function () {
			const repository = new NonprofitsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Nonprofit model', function () {
			const data = TestHelper.generate.data('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.get(data.uuid), function (model) {
				assert.ok(model instanceof Nonprofit);
				assert.equal(model.uuid, data.uuid);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouReject(repository.get('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Nonprofit models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('nonprofit', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Nonprofit);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the Nonprofit model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouReject(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the Nonprofit model', function () {
			const model = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.save(model), function (nonprofit) {
				assert.ok(nonprofit instanceof Nonprofit);
				assert.equal(nonprofit.uuid, model.uuid);
			});
		});

		it('should call reject for an invalid Nonprofit model', function () {
			const model = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouReject(repository.save(new Nonprofit()));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('nonprofit');
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouReject(repository.save(model));
		});

	});

	describe('#querySlug()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should validate slug in Nonprofit model', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('nonprofit', count);
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, data);
			});
			const model = TestHelper.generate.model('nonprofit');
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.querySlug(model), function (nonprofit) {
				assert.equal(nonprofit.slug, model.slug);
			});
		});

		it('should fix empty slug in Nonprofit model', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('nonprofit', count);
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, {Items: data});
			});
			const model = TestHelper.generate.model('nonprofit', {slug: ''});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.querySlug(model), function (nonprofit) {
				assert.equal(nonprofit.slug, model.slug);
			});
		});

		it('should fix duplicate slug in Nonprofit model', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('nonprofit', count, {slug: 'slug-me'});
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, {Items: data});
			});
			const model = TestHelper.generate.model('nonprofit', {slug: 'slug-me'});
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouResolve(repository.querySlug(model), function (nonprofit) {
				assert.equal(nonprofit.slug, model.slug);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('nonprofit');
			const repository = new NonprofitsRepository();
			return promiseMe.thatYouReject(repository.querySlug(model));
		});

	});

});