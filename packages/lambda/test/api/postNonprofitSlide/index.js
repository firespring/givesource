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