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
const MetricsRepository = require('./../../../src/repositories/metrics');
const PatchMetrics = require('./../../../src/api/patchMetrics/index');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('PatchMetrics', function () {

	afterEach(function () {
		MetricsRepository.prototype.batchUpdate.restore();
	});

	it('should return update metrics', function () {
		const models = TestHelper.generate.modelCollection('metric', 3);
		sinon.stub(MetricsRepository.prototype, 'batchUpdate').resolves();
		const params = {
			body: {
				metrics: models.map(function (model) {
					return model.all()
				}),
			}
		};
		return PatchMetrics.handle(params, null, function (error) {
			assert(error === undefined);
		});
	});

	it('should return error on exception thrown', function () {
		const models = TestHelper.generate.modelCollection('metric', 3);
		const params = {
			body: {
				metrics: models.map(function (model) {
					return model.all()
				}),
			}
		};
		sinon.stub(MetricsRepository.prototype, 'batchUpdate').rejects('Error');
		return PatchMetrics.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});