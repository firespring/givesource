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
const sinon = require('sinon');
const GetNonprofitSlide = require('../../../src/api/getNonprofitSlide/index');
const NonprofitSlidesRepository = require('../../../src/repositories/nonprofitSlides');
const TestHelper = require('../../helpers/test');

describe('GetNonprofitSlide', function () {

	afterEach(function () {
		NonprofitSlidesRepository.prototype.get.restore();
	});

	it('should return a slide', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const slide = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
		sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(slide);
		const params = {
			params: {
				nonprofitUuid: nonprofit.uuid,
				slideUuid: slide.uuid
			}
		};
		return GetNonprofitSlide.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, slide.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(NonprofitSlidesRepository.prototype, 'get').rejects('Error');
		const params = {
			params: {
				nonprofitUuid: '1234',
				slideUuid: '1234'
			}
		};
		return GetNonprofitSlide.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});