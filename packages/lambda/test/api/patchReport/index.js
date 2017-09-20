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
const sinon = require('sinon');
const PatchReport = require('../../../src/api/patchReport/index');
const ReportsRepository = require('../../../src/repositories/reports');
const TestHelper = require('../../helpers/test');

describe('PatchReport', function () {

	afterEach(function () {
		ReportsRepository.prototype.get.restore();
		ReportsRepository.prototype.save.restore();
	});

	it('should return an updated report', function () {
		const original = TestHelper.generate.model('report');
		const updated = TestHelper.generate.model('report', {uuid: original.uuid});
		sinon.stub(ReportsRepository.prototype, 'get').resolves(original);
		sinon.stub(ReportsRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except('uuid'),
			params: {
				reportUuid: original.uuid
			}
		};
		return PatchReport.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const original = TestHelper.generate.model('report');
		const params = {
			params: {
				reportUuid: original.uuid
			}
		};
		sinon.stub(ReportsRepository.prototype, 'get').rejects('Error');
		sinon.stub(ReportsRepository.prototype, 'save').resolves(original);
		return PatchReport.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const original = TestHelper.generate.model('report');
		const params = {
			params: {
				reportUuid: original.uuid
			}
		};
		sinon.stub(ReportsRepository.prototype, 'get').resolves(original);
		sinon.stub(ReportsRepository.prototype, 'save').rejects('Error');
		return PatchReport.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});