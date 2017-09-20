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
			{model: TestHelper.generate.model('model'), param: 'createdOn', value: '123456', error: false},
			{model: TestHelper.generate.model('model'), param: 'createdOn', value: 123456, error: false},
		];
		TestHelper.validate(tests);
	});

});