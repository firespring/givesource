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

const assert = require('assert')
const promiseMe = require('mocha-promise-me')
const HttpException = require('./../../../src/exceptions/http')
const PostNonprofitSlide = require('./../../../src/api/postNonprofitSlide/index')
const NonprofitsRepository = require('./../../../src/repositories/nonprofits')
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('PostNonprofitSlide', function () {
  it('should return a slide', async function () {
    const model = {}
    const nonprofitId = 123
    const body = { someUpdatedParam: 'updated' }
    const existingSlideCount = 1

    sinon.stub(NonprofitSlidesRepository.prototype, 'populate').resolves(model)
    const upsertStub = sinon.stub(NonprofitSlidesRepository.prototype, 'upsert').resolves(model)
    sinon.stub(NonprofitSlidesRepository.prototype, 'getCount').resolves(existingSlideCount)

    const result = await TestHelper.callApi(PostNonprofitSlide, { nonprofit_id: nonprofitId }, null, { body })
    assert(result === model)
    assert(upsertStub.withArgs(model, { nonprofitId, sortOrder: existingSlideCount }).callCount === 1)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    const model = {}
    sinon.stub(NonprofitSlidesRepository.prototype, 'populate').resolves(model)
    sinon.stub(NonprofitSlidesRepository.prototype, 'getCount').resolves(1)
    sinon.stub(NonprofitSlidesRepository.prototype, 'upsert').rejects(errorStub)

    const response = TestHelper.callApi(PostNonprofitSlide)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
