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
const GetNonprofitSlides = require('./../../../src/api/getNonprofitSlides/index')
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('GetNonprofitSlides', function () {
  it('should return a list of nonprofit slides', async function () {
    const nonprofit = await TestHelper.generate.model('nonprofit')
    const models = await TestHelper.generate.modelCollection('nonprofitSlide', 3, { nonprofitUuid: nonprofit.uuid })
    sinon.stub(NonprofitSlidesRepository.prototype, 'getAll').resolves(models)

    const result = await TestHelper.callApi(GetNonprofitSlides)
    assert(result === models)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(NonprofitSlidesRepository.prototype, 'getAll').rejects(errorStub)
    const response = TestHelper.callApi(GetNonprofitSlides)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
