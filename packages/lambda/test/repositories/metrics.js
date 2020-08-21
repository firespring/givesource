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
const Metric = require('./../../src/dynamo-models/metric');
const MetricsRepository = require('./../../src/repositories/metrics');
const promiseMe = require('mocha-promise-me');
const Repository = require('./../../src/repositories/repository');
const TestHelper = require('./../helpers/test');

describe('MetricsRepository', function () {

	describe('#construct()', function () {

		it('should be an instance of Repository', function () {
			const repository = new MetricsRepository();
			assert.ok(repository instanceof Repository);
		});

		it('should be an instance of MetricsRepository', function () {
			const repository = new MetricsRepository();
			assert.ok(repository instanceof MetricsRepository);
		});

		it('should set the database table', function () {
			const repository = new MetricsRepository();
			assert.ok(repository.table !== null);
		});

	});

	describe('#getAll()', function () {

		afterEach(function () {
			AWS.restore('DynamoDB.DocumentClient');
		});

		it('should return all Metrics models', function () {
			const count = 3;
			const data = TestHelper.generate.dataCollection('metric', count);
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback(null, {
					Count: count,
					Items: data
				});
			});
			const repository = new MetricsRepository();
			return promiseMe.thatYouResolve(repository.getAll(), function (models) {
				for (let i = 0; i < count; i++) {
					const model = models[i];
					assert.ok(model instanceof Metric);
					assert.equal(model.uuid, data[i].uuid);
					assert.equal(model.key, data[i].key);
				}
			});
		});

		it('should call reject on an error', function () {
			AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
				callback('Error');
			});
			const repository = new MetricsRepository();
			return promiseMe.thatYouReject(repository.getAll());
		});

	});

});