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
const Slide = require('../../src/models/slide');
const NonprofitSlidesRepository = require('../../src/repositories/nonprofitSlides');
const Repository = require('../../src/repositories/repository');
const TestHelper = require('../helpers/test');

const promiseMe = require('mocha-promise-me');

describe('NonprofitSlidesRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new NonprofitSlidesRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of NonprofitSlidesRepository', function () {
			const repository = new NonprofitSlidesRepository();
			assert.ok(repository instanceof NonprofitSlidesRepository);
		});

		it('should set the database table', function () {
			const repository = new NonprofitSlidesRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Slide model', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			const data = TestHelper.generate.data('slide', {nonprofitUuid: nonprofit.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, {Items: [data]});
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouResolve(repository.get(nonprofit.uuid, data.uuid), function (model) {
				assert.ok(model instanceof Slide);
				assert.equal(model.uuid, data.uuid);
			});
		});

		it('should call reject on an error', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouReject(repository.get('1234', '1234'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Slide models', function () {
			const count = 3;
			const nonprofit = TestHelper.generate.model('nonprofit');
			const data = TestHelper.generate.dataCollection('slide', count, {nonprofitUuid: nonprofit.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouResolve(repository.getAll(nonprofit.uuid), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Slide);
					assert.equal(model.uuid, data[i].uuid);
				}
			});
		});

		it('should call reject on an error', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouReject(repository.getAll('1234'));
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the Slide model', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouResolve(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouReject(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the Slide model', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			const model = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouResolve(repository.save(model.nonprofitUuid, model), function (slide) {
				assert.ok(slide instanceof Slide);
				assert.equal(slide.uuid, model.uuid);
			});
		});

		it('should call reject for an invalid Slide model', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			const model = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouReject(repository.save(model.nonprofitUuid, new Slide()));
		});

		it('should call reject on an error', function () {
			const nonprofit = TestHelper.generate.model('nonprofit');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: nonprofit.all()});
			});
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('slide');
			const repository = new NonprofitSlidesRepository();
			return promiseMe.thatYouReject(repository.save(model.nonprofitUuid, model));
		});

	});

});