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
const TestHelper = require('../helpers/test');
const QueryBuilder = require('../../src/aws/queryBuilder');

const promiseMe = require('mocha-promise-me');

describe('Repository', function () {

	describe('#getByKey()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return the item', function () {
			const data = TestHelper.generate.data('model');
			AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
				callback(null, {Item: data});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.getByKey('uuid', data.uuid), function (response) {
				assert.equal(response.Item.uuid, data.uuid);
				assert.equal(response.Item.createdOn, data.createdOn);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.getByKey('uuid', '9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

	});

	describe('#deleteByKey()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete the item', function () {
			AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
				callback();
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.deleteByKey('uuid', '9ba33b63-41f9-4efc-8869-2b50a35b53df'));
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.deleteByKey('uuid'));
		});

	});

	describe('#batchDelete()', () => {

		afterEach(() => {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should delete models', function () {
			const count = 25;
			const models = TestHelper.generate.modelCollection('model', count);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback();
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchDelete(models), function (response) {
				assert.ok(typeof response === 'undefined');
			});
		});

		it('should resolve with unprocessed items', function () {
			const models = TestHelper.generate.modelCollection('model', 25);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback(null, {
					UnprocessedItems: {
						'test-Table': [
							{
								DeleteRequest: {
									Item: TestHelper.generate.model('model')
								}
							},
							{
								DeleteRequest: {
									Item: TestHelper.generate.model('model')
								}
							}
						]
					}
				});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchDelete(models), function (data) {
				assert.equal(data.UnprocessedItems.length, 2);
			});
		});

		it('should call reject on an error', function () {
			const count = 66;
			const models = TestHelper.generate.modelCollection('model', count);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.batchDelete(models));
		});

	});

	describe('#scan()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all items', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('model', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.scan(), function (response) {
				for (let i = 0; i < count; i++) {
					assert.equal(response.Items[i].uuid, data[i].uuid);
				}
				assert.equal(response.Count, count);
			});
		});

		it('should call reject on an error', function () {
			const model = TestHelper.generate.model('model');
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.scan(model));
		});

	});

	describe('#batchScan()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all models', function () {
			const count = 50;
			const data = TestHelper.generate.dataCollection('model', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchScan(), function (response) {
				for (let i = 0; i < count; i++) {
					assert.equal(response.Items[i].uuid, data[i].uuid);
				}
				assert.equal(response.Count, count);
			});
		});

		it('should call reject on an error', function () {
			const models = TestHelper.generate.modelCollection('model', 66);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.batchScan(models));
		});

	});

	describe('#batchUpdate()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update models', function () {
			const count = 50;
			const models = TestHelper.generate.modelCollection('model', count);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback(null, {
					Count: count,
					Items: models
				});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchUpdate(models), function (response) {
				assert.ok(typeof response === 'undefined');
			});
		});

		it('should resolve with unprocessed items', function () {
			const models = TestHelper.generate.modelCollection('nonprofit', 25);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback(null, {
					UnprocessedItems: {
						'test-Table': [
							{
								PutRequest: {
									Item: TestHelper.generate.model('model')
								}
							},
							{
								PutRequest: {
									Item: TestHelper.generate.model('model')
								}
							}
						]
					}
				});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchUpdate(models), function (data) {
				assert.equal(data.UnprocessedItems.length, 2);
			});
		});

		it('should call reject on an error', function () {
			const models = TestHelper.generate.modelCollection('model', 10);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.batchUpdate(models));
		});

	});

	describe('#batchWrite()', function () {
		const requestItems = [{
			'test-Table': [
				{
					PutRequest: {
						Item: TestHelper.generate.model('model')
					}
				},
				{
					DeleteRequest: {
						Item: TestHelper.generate.model('model')
					}
				}
			]
		}];
		const unprocessedItems = {
			UnprocessedItems: {
				'test-Table': [
					{
						PutRequest: {
							Item: TestHelper.generate.model('model')
						}
					},
					{
						DeleteRequest: {
							Item: TestHelper.generate.model('model')
						}
					}
				]
			}
		};

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should write models', function () {
			const count = 50;
			const models = TestHelper.generate.modelCollection('model', count);
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback(null, {
					Count: count,
					Items: models
				});
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchWrite(models), function (response) {
				assert.ok(typeof response === 'undefined');
			});
		});

		it('should resolve with unprocessed items', function () {
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback(null, unprocessedItems);
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.batchWrite(requestItems), function (data) {
				assert.equal(data.UnprocessedItems.length, 2);
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
				callback('Error', null);
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.batchWrite(requestItems));
		});

	});

	describe('#query()', function () {
		const data = TestHelper.generate.data('model');
		const builder = new QueryBuilder('query');
		builder.index('createdOnIndex');

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should query data into an array', function () {
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback(null, data);
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.query(builder), function (result) {
				assert.equal(data, result);
			});
		});

		it('should throw error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.query(builder));
		});

	});

	describe('#put()', function () {
		const data = TestHelper.generate.data('model');

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should update(put) data in a model', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback(null, data);
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouResolve(repository.put(data.uuid, data), function (result) {
				assert.equal(data, result);
			});
		});

		it('should throw error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
				callback('Error');
			});
			const repository = new Repository();
			repository.table = 'test-Table';
			return promiseMe.thatYouReject(repository.put(data.uuid, data));
		});

	});

	describe('#buildUpdateExpression()', function () {
		const data = {
			uuid: 'd08eb977-bda9-4fa1-a2ec-e9802e8668df',
			createdOn: 11499288551800,
			email: 'alex.rocks@firespring.com'
		};

		it('should return an array of objects', function () {
			const repository = new Repository();
			repository.table = 'test-Table';
			let func = repository.buildUpdateExpression(data);
			let updateExpression = func[0];
			let attributeNames = func[1];
			let attributeValues = func[2];
			assert.equal(updateExpression, 'SET #uuid = :uuid, #createdOn = :createdOn, #email = :email ');
			assert.deepEqual(attributeNames, { '#uuid': 'uuid', '#createdOn': 'createdOn', '#email': 'email' });
			assert.deepEqual(attributeValues, { ':uuid': 'd08eb977-bda9-4fa1-a2ec-e9802e8668df',
				':createdOn': 11499288551800, ':email': 'alex.rocks@firespring.com' });
		});

	});

});