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
const PostNonprofitSlide = require('../../../src/api/postNonprofitSlide/index');
const NonprofitSlidesRepository = require('../../../src/repositories/nonprofitSlides');
const TestHelper = require('../../helpers/test');

describe('PostNonprofitSlide', function () {

	afterEach(function () {
		NonprofitSlidesRepository.prototype.save.restore();
	});

	it('should return a slide', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const model = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').resolves(model);
		const params = {
			body: model.all(),
			params: {
				nonprofitUuid: nonprofit.uuid
			}
		};
		return PostNonprofitSlide.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, model.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').rejects('Error');
		return PostNonprofitSlide.handle({}, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});