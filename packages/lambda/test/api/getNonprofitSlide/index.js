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
const GetNonprofitSlide = require('./../../../src/api/getNonprofitSlide/index');
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('GetNonprofitSlide', function () {

	afterEach(function () {
		NonprofitSlidesRepository.prototype.get.restore();
	});

	it('should return a nonprofit slide', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const slide = TestHelper.generate.model('nonprofitSlide', {nonprofitUuid: nonprofit.uuid});
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