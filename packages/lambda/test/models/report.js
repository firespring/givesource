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
const Model = require('../../src/models/model');
const Report = require('../../src/models/report');
const ReportHelper = require('../../src/helpers/report');
const TestHelper = require('../helpers/test');

describe('Report', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			const model = new Report();
			assert.ok(model instanceof Model);
		});

		it('should be an instance of Report', function () {
			const model = new Report();
			assert.ok(model instanceof Report);
		});

	});

	describe('#populate()', function () {

		it('should generate status', function () {
			const model = new Report();
			assert.equal(model.status, 'PENDING');
		});

		it('should only allow defined attributes', function () {
			const model = new Report({test1: 123, test2: 'test', test3: true});
			assert.equal(model.test1, undefined);
			assert.equal(model.test2, undefined);
			assert.equal(model.test3, undefined);
		});

	});

	describe('#validate()', function () {
		const tests = [
			{model: TestHelper.generate.model('report'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('report'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('report'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('report'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('report'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('report'), param: 'createdOn', value: '123456', error: true},
			{model: TestHelper.generate.model('report'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('report'), param: 'isDeleted', value: null, error: true},
			{model: TestHelper.generate.model('report'), param: 'isDeleted', value: 'test', error: true},
			{model: TestHelper.generate.model('report'), param: 'isDeleted', value: '123456', error: true},
			{model: TestHelper.generate.model('report'), param: 'isDeleted', value: 123456, error: true},
			{model: TestHelper.generate.model('report'), param: 'isDeleted', value: 0, error: false},
			{model: TestHelper.generate.model('report'), param: 'isDeleted', value: 1, error: false},
			{model: TestHelper.generate.model('report'), param: 'status', value: null, error: true},
			{model: TestHelper.generate.model('report'), param: 'status', value: '', error: true},
			{model: TestHelper.generate.model('report'), param: 'status', value: 'test', error: true},
			{model: TestHelper.generate.model('report'), param: 'status', value: 123456, error: true},
			{model: TestHelper.generate.model('report'), param: 'status', value: ReportHelper.STATUS_FAILED, error: false},
			{model: TestHelper.generate.model('report'), param: 'status', value: ReportHelper.STATUS_PENDING, error: false},
			{model: TestHelper.generate.model('report'), param: 'status', value: ReportHelper.STATUS_SUCCESS, error: false},
			{model: TestHelper.generate.model('report'), param: 'type', value: null, error: true},
			{model: TestHelper.generate.model('report'), param: 'type', value: 'test', error: true},
			{model: TestHelper.generate.model('report'), param: 'type', value: '', error: true},
			{model: TestHelper.generate.model('report'), param: 'type', value: ReportHelper.TYPE_ALL_DONATIONS, error: false},
			{model: TestHelper.generate.model('report'), param: 'type', value: ReportHelper.TYPE_NONPROFIT_DONATIONS, error: false},
			{model: TestHelper.generate.model('report'), param: 'url', value: null, error: true},
			{model: TestHelper.generate.model('report'), param: 'url', value: '', error: true},
			{model: TestHelper.generate.model('report'), param: 'url', value: 'http://test.com/report', error: false},
			{model: TestHelper.generate.model('report'), param: 'url', value: 123456, error: true},
		];
		TestHelper.validate(tests);
	});

});