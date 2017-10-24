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
const promiseMe = require('mocha-promise-me');
const Repository = require('./../../src/repositories/repository');
const Setting = require('./../../src/models/setting');
const SettingsRepository = require('./../../src/repositories/settings');
const TestHelper = require('./../helpers/test');

describe('SettingsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new SettingsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of SettingsRepository', function () {
			const repository = new SettingsRepository();
			assert.ok(repository instanceof SettingsRepository);
		});

		it('should set the database table', function () {
			const repository = new SettingsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#get()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return a Setting model', function () {
			const data = TestHelper.generate.data('setting');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouResolve(repository.get(data.key), function (model) {
				assert.ok(model instanceof Setting);
				assert.equal(model.uuid, data.uuid);
				assert.equal(model.key, data.key);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback('Error');
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouReject(repository.get('TEST_SETTING'));
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Settings models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('setting', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Setting);
					assert.equal(model.uuid, data[i].uuid);
					assert.equal(model.key, data[i].key);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

	describe('#delete()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the Settings model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback(null, {});
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouResolve(repository.delete('TEST_SETTING'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback('Error');
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouReject(repository.delete('TEST_SETTING'));
		});

	});

	describe('#save()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update the Setting model', function () {
			const model = TestHelper.generate.model('setting');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouResolve(repository.save(model), function (message) {
				assert.ok(message instanceof Setting);
				assert.equal(message.uuid, model.uuid);
				assert.equal(message.key, model.key);
			});
		});

		it('should call reject for an invalid Setting model', function () {
			const model = TestHelper.generate.model('setting');
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, {Attributes: model.all()});
			});
			const repository = new SettingsRepository();
			return promiseMe.thatYouReject(repository.save(new Setting()));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const model = TestHelper.generate.model('setting');
			const repository = new SettingsRepository();
			return promiseMe.thatYouReject(repository.save(model));
		});

	});

});