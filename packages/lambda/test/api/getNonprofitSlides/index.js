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
const GetNonprofitSlides = require('./../../../src/api/getNonprofitSlides/index')
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('GetNonprofitSlides', function () {
  it('should return a list of nonprofit slides', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    const models = TestHelper.generate.modelCollection('nonprofitSlide', 3, { nonprofitUuid: nonprofit.uuid })
    sinon.stub(NonprofitSlidesRepository.prototype, 'getAll').resolves(models)
    const params = {
      params: {
        nonprofitUuid: nonprofit.uuid
      }
    }
    return GetNonprofitSlides.handle(params, null, function (error, results) {
      assert(error === null)
      assert(results.length === 3)
      results.forEach(function (result, i) {
        assert(result.uuid === models[i].uuid)
      })
    })
  })

  it('should return error on exception thrown', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    sinon.stub(NonprofitSlidesRepository.prototype, 'getAll').rejects('Error')
    const params = {
      params: {
        nonprofitUuid: nonprofit.uuid
      }
    }
    return GetNonprofitSlides.handle(params, null, function (error, results) {
      assert(error instanceof Error)
    })
  })
})
