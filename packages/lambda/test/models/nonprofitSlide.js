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
const NonprofitSlide = require('../../src/models/nonprofitSlide');
const NonprofitSlideHelper = require('../../src/helpers/nonprofitSlide');
const TestHelper = require('../helpers/test');

describe('NonprofitSlide', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			const model = new NonprofitSlide();
			assert.ok(model instanceof Model);
		});

		it('should be an instance of NonprofitSlide', function () {
			const model = new NonprofitSlide();
			assert.ok(model instanceof NonprofitSlide);
		});

	});

	describe('#populate()', function () {

		it('should only allow defined attributes', function () {
			const model = new NonprofitSlide({test1: 123, test2: 'test', test3: true});
			assert.equal(model.test1, undefined);
			assert.equal(model.test2, undefined);
			assert.equal(model.test3, undefined);
		});

	});

	describe('#validate()', function () {
		const tests = [
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'createdOn', value: '123456', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'isDeleted', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'isDeleted', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'isDeleted', value: '123456', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'isDeleted', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'isDeleted', value: 0, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'isDeleted', value: 1, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'caption', value: null, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'caption', value: '', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'caption', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'caption', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'filename', value: null, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'filename', value: '', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'filename', value: 'test', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'filename', value: 123456, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'nonprofitUuid', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'nonprofitUuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'nonprofitUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'sortOrder', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'sortOrder', value: '', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'sortOrder', value: 'test', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'sortOrder', value: 123456, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'type', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'type', value: 'adsf', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'type', value: '', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'type', value: NonprofitSlideHelper.TYPE_IMAGE, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'type', value: NonprofitSlideHelper.TYPE_VIMEO, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'type', value: NonprofitSlideHelper.TYPE_YOUTUBE, error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'url', value: null, error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'url', value: '', error: true},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'url', value: 'http://test.com/image.jpg', error: false},
			{model: TestHelper.generate.model('nonprofitSlide'), param: 'url', value: 123456, error: true},
		];
		TestHelper.validate(tests);
	});

});