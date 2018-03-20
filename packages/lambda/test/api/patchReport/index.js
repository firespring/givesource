/*
 * Copyright 2018 Firespring, Inc.
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