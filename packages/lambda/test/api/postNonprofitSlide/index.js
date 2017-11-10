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
const HttpException = require('./../../../src/exceptions/http');
const PostNonprofitSlide = require('./../../../src/api/postNonprofitSlide/index');
const NonprofitsRepository = require('./../../../src/repositories/nonprofits');
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('PostNonprofitSlide', function () {

	afterEach(function () {
		NonprofitsRepository.prototype.get.restore();
		NonprofitSlidesRepository.prototype.getCount.restore();
		NonprofitSlidesRepository.prototype.save.restore();
	});

	it('should return a slide', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const model = TestHelper.generate.model('nonprofitSlide', {nonprofitUuid: nonprofit.uuid});
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit);
		sinon.stub(NonprofitSlidesRepository.prototype, 'getCount').resolves(1);
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').resolves(model);
		const params = {
			body: model.except(['uuid', 'createdOn']),
			params: {
				nonprofit_uuid: nonprofit.uuid
			}
		};
		return PostNonprofitSlide.handle(params, null, function (error, result) {
			assert(error === null);
			TestHelper.assertModelEquals(result, model, ['uuid', 'createdOn']);
		});
	});

	it('should return error on exception thrown', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit);
		sinon.stub(NonprofitSlidesRepository.prototype, 'getCount').resolves(1);
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').rejects('Error');
		return PostNonprofitSlide.handle({}, null, function (error) {
			assert(error instanceof HttpException);
		});
	});

});