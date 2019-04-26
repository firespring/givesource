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
const Donor = require('../../src/models/donor');
const Model = require('../../src/models/model');
const TestHelper = require('../helpers/test');

describe('Donor', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			const model = new Donor();
			assert.ok(model instanceof Model);
		});

		it('should be an instance of Donor', function () {
			const model = new Donor();
			assert.ok(model instanceof Donor);
		});

	});

	describe('#populate()', function () {

		it('should only allow defined attributes', function () {
			const model = new Donor({test1: 123, test2: 'test', test3: true});
			assert.equal(model.test1, undefined);
			assert.equal(model.test2, undefined);
			assert.equal(model.test3, undefined);
		});

	});

	describe('#validate', function () {
		const tests = [
			{model: TestHelper.generate.model('donor'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('donor'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('donor'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('donor'), param: 'createdOn', value: '123456', error: true},
			{model: TestHelper.generate.model('donor'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('donor'), param: 'isDeleted', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'isDeleted', value: 'test', error: true},
			{model: TestHelper.generate.model('donor'), param: 'isDeleted', value: '123456', error: true},
			{model: TestHelper.generate.model('donor'), param: 'isDeleted', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'isDeleted', value: 0, error: false},
			{model: TestHelper.generate.model('donor'), param: 'isDeleted', value: 1, error: false},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'city', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'city', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'city', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'city', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'email', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'email', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'email', value: 'test@email.com', error: false},
			{model: TestHelper.generate.model('donor'), param: 'email', value: 'test', error: true},
			{model: TestHelper.generate.model('donor'), param: 'email', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'firstName', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'firstName', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'firstName', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'firstName', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'lastName', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'lastName', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'lastName', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'lastName', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'state', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'state', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'state', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'state', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: 123456, error: true}
		];
		TestHelper.validate(tests);
	});

});