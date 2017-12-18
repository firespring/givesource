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