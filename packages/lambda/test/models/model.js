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
const TestHelper = require('../helpers/test');

describe('Model', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			let model = new Model();
			assert.ok(model instanceof Model);
		});

	});

	describe('#populate()', function () {

		it('should generate uuid', function () {
			let model = new Model();

			assert.ok(model.uuid);
			assert.ok(model.uuid.length === 36);
		});

		it('should generate createdOn', function () {
			let model = new Model();

			assert.ok(model.createdOn);
			assert.ok(model.createdOn > 0);
		});

		it('should only allow defined attributes', function () {
			let model = new Model({
				uuid: '9ba33b63-41f9-4efc-8869-2b50a35b53df',
				createdOn: 1497376857112,
				test: '1234',
				test2: false
			});
			assert.equal(model.uuid, '9ba33b63-41f9-4efc-8869-2b50a35b53df');
			assert.equal(model.createdOn, 1497376857112);
			assert.equal(model.test, undefined);
			assert.equal(model.test2, undefined);
		});

	});

	describe('#validate()', function () {
		const tests = [
			{model: TestHelper.generate.model('model'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('model'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('model'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('model'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('model'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('model'), param: 'createdOn', value: '123456', error: true},
			{model: TestHelper.generate.model('model'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('model'), param: 'isDeleted', value: null, error: true},
			{model: TestHelper.generate.model('model'), param: 'isDeleted', value: 'test', error: true},
			{model: TestHelper.generate.model('model'), param: 'isDeleted', value: '123456', error: true},
			{model: TestHelper.generate.model('model'), param: 'isDeleted', value: 123456, error: true},
			{model: TestHelper.generate.model('model'), param: 'isDeleted', value: 0, error: false},
			{model: TestHelper.generate.model('model'), param: 'isDeleted', value: 1, error: false},
		];
		TestHelper.validate(tests);
	});

});