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
const GetNonprofitSlide = require('./../../../src/api/getNonprofitSlide/index')
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('GetNonprofitSlide', function () {
  it('should return a nonprofit slide', async function () {
    const nonprofit = await TestHelper.generate.model('nonprofit')
    const slide = await TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
    sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(slide)

    const result = await TestHelper.callApi(GetNonprofitSlide)
    assert(result === slide)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(NonprofitSlidesRepository.prototype, 'get').rejects(errorStub)
    const response = TestHelper.callApi(GetNonprofitSlide)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
