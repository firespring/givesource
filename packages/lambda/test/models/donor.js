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
			{model: TestHelper.generate.model('donor'), param: 'address1', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address1', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'address2', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'city', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'city', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'city', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'city', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'email', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'email', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'email', value: 'test@email.com', error: false},
			{model: TestHelper.generate.model('donor'), param: 'email', value: 'test', error: true},
			{model: TestHelper.generate.model('donor'), param: 'email', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'name', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'name', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'name', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'name', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: null, error: false},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: '', error: false},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'phone', value: 123456, error: false},
			{model: TestHelper.generate.model('donor'), param: 'state', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'state', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'state', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'state', value: 123456, error: true},
			{model: TestHelper.generate.model('donor'), param: 'totalAmountInCents', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'totalAmountInCents', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'totalAmountInCents', value: '123456', error: false},
			{model: TestHelper.generate.model('donor'), param: 'totalAmountInCents', value: 123456, error: false},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: null, error: true},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: '', error: true},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: 'test', error: false},
			{model: TestHelper.generate.model('donor'), param: 'zip', value: 123456, error: false}
		];
		TestHelper.validate(tests);
	});

});