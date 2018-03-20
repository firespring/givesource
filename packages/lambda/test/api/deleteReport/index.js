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
const DeleteReport = require('../../../src/api/deleteReport/index');
const ReportsRepository = require('../../../src/repositories/reports');
const TestHelper = require('../../helpers/test');

describe('DeleteReport', function () {

	afterEach(function () {
		ReportsRepository.prototype.delete.restore();
	});

	it('should delete a report', function () {
		const model = TestHelper.generate.model('report');
		sinon.stub(ReportsRepository.prototype, 'delete').resolves(model);
		const params = {
			params: {
				report_uuid: model.uuid
			}
		};
		return DeleteReport.handle(params, null, function (error, result) {
			assert(error === undefined);
			assert(result === undefined);
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(ReportsRepository.prototype, 'delete').rejects('Error');
		const params = {
			params: {
				report_uuid: '1234'
			}
		};
		return DeleteReport.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});