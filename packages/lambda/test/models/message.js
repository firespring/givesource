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
const Message = require('../../src/models/message');
const Model = require('../../src/models/model');
const TestHelper = require('../helpers/test');

describe('Message', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			const model = new Message();
			assert.ok(model instanceof Model);
		});

		it('should be an instance of Message', function () {
			const model = new Message();
			assert.ok(model instanceof Message);
		});

	});

	describe('#populate()', function () {

		it('should only allow defined attributes', function () {
			const model = new Message({test1: 123, test2: 'test', test3: true});
			assert.equal(model.test1, undefined);
			assert.equal(model.test2, undefined);
			assert.equal(model.test3, undefined);
		});

	});

	describe('#validate()', function () {
		const tests = [
			{model: TestHelper.generate.model('message'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('message'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('message'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('message'), param: 'createdOn', value: '123456', error: true},
			{model: TestHelper.generate.model('message'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('message'), param: 'isDeleted', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'isDeleted', value: 'test', error: true},
			{model: TestHelper.generate.model('message'), param: 'isDeleted', value: '123456', error: true},
			{model: TestHelper.generate.model('message'), param: 'isDeleted', value: 123456, error: true},
			{model: TestHelper.generate.model('message'), param: 'isDeleted', value: 0, error: false},
			{model: TestHelper.generate.model('message'), param: 'isDeleted', value: 1, error: false},
			{model: TestHelper.generate.model('message'), param: 'email', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'email', value: '', error: true},
			{model: TestHelper.generate.model('message'), param: 'email', value: 'test@email.com', error: false},
			{model: TestHelper.generate.model('message'), param: 'email', value: 'test', error: true},
			{model: TestHelper.generate.model('message'), param: 'email', value: 123456, error: true},
			{model: TestHelper.generate.model('message'), param: 'message', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'message', value: '', error: true},
			{model: TestHelper.generate.model('message'), param: 'message', value: 'test', error: false},
			{model: TestHelper.generate.model('message'), param: 'message', value: 123456, error: true},
			{model: TestHelper.generate.model('message'), param: 'name', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'name', value: '', error: true},
			{model: TestHelper.generate.model('message'), param: 'name', value: 'test', error: false},
			{model: TestHelper.generate.model('message'), param: 'name', value: 123456, error: true},
			{model: TestHelper.generate.model('message'), param: 'phone', value: null, error: false},
			{model: TestHelper.generate.model('message'), param: 'phone', value: '', error: false},
			{model: TestHelper.generate.model('message'), param: 'phone', value: 'test', error: false},
			{model: TestHelper.generate.model('message'), param: 'phone', value: 123456, error: false},
			{model: TestHelper.generate.model('message'), param: 'type', value: null, error: true},
			{model: TestHelper.generate.model('message'), param: 'type', value: 'adsf', error: true},
			{model: TestHelper.generate.model('message'), param: 'type', value: '', error: true},
			{model: TestHelper.generate.model('message'), param: 'type', value: 'CONTACT', error: false},
			{model: TestHelper.generate.model('message'), param: 'type', value: 'FEEDBACK', error: false},
		];
		TestHelper.validate(tests);
	});

});