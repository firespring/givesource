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
const Metric = require('./../../src/models/metric');
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