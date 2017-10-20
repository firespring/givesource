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
const Nonprofit = require('../../src/models/nonprofit');
const NonprofitHelper = require('../../src/helpers/nonprofit');
const TestHelper = require('../helpers/test');

describe('Nonprofit', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			let model = new Nonprofit();
			assert.ok(model instanceof Model);
		});

		it('should be an instance of Nonprofit', function () {
			let model = new Nonprofit();
			assert.ok(model instanceof Nonprofit);
		});

	});

	describe('#populate()', function () {

		it('should generate donationsCount', function () {
			let model = new Nonprofit();
			assert.equal(model.donationsCount, 0);
		});

		it('should generate donationsSum', function () {
			let model = new Nonprofit();
			assert.equal(model.donationsSum, 0);
		});

		it('should generate status', function () {
			let model = new Nonprofit();
			assert.equal(model.status, 'PENDING');
		});

		it('should only allow defined attributes', function () {
			const model = new Nonprofit({test1: 123, test2: 'test', test3: true});
			assert.equal(model.test1, undefined);
			assert.equal(model.test2, undefined);
			assert.equal(model.test3, undefined);
		});

	});

	describe('#validate()', function () {
		const tests = [
			{model: TestHelper.generate.model('nonprofit'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: '123456', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address1', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'address1', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'address1', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address1', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'address2', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address2', value: '', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address2', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address2', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'address3', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address3', value: '', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address3', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'address3', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'category1', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'category1', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'category1', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category1', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'category2', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category2', value: '', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category2', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category2', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'category3', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category3', value: '', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category3', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'category3', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'city', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'city', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'city', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'city', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: 123456, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsSum', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsSum', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsSum', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'donationsSum', value: 123456, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: '123456', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'phone', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'phone', value: '', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'phone', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'phone', value: 123456, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: null, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: '', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'slug', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'slug', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'slug', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'slug', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'state', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'state', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'state', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'state', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_ACTIVE, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_DENIED, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_PENDING, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_REVOKED, error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'zip', value: null, error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'zip', value: '', error: true},
			{model: TestHelper.generate.model('nonprofit'), param: 'zip', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofit'), param: 'zip', value: 123456, error: false},
		];
		TestHelper.validate(tests);
	});

});