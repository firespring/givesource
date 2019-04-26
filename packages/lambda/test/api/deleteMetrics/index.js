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
const DeleteMetrics = require('./../../../src/api/deleteMetrics/index');
const MetricsRepository = require('./../../../src/repositories/metrics');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('DeleteMetrics', function () {

	afterEach(function () {
		MetricsRepository.prototype.batchDeleteByKey.restore();
	});

	it('should delete metrics', function () {
		const models = TestHelper.generate.modelCollection('metric', 3);
		sinon.stub(MetricsRepository.prototype, 'batchDeleteByKey').resolves();
		const event = {
			body: {
				metrics: models,
			}
		};
		return DeleteMetrics.handle(event, null, function (error, result) {
			assert(error === undefined);
			assert(result === undefined);
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(MetricsRepository.prototype, 'batchDeleteByKey').rejects('Error');
		const event = {
			body: {
				metrics: [],
			}
		};
		return DeleteMetrics.handle(event, null, function (error) {
			assert(error instanceof Error);
		});
	});

});