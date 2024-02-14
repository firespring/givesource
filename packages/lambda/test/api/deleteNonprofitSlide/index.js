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
const DeleteNonprofitSlide = require('./../../../src/api/deleteNonprofitSlide/index')
const NonprofitsRepository = require('./../../../src/repositories/nonprofits')
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('DeleteNonprofitSlide', function () {
  it('should delete a nonprofit slide', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    const model = TestHelper.generate.model('nonprofitSlide')
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    sinon.stub(NonprofitSlidesRepository.prototype, 'delete').resolves(model)
    const params = {
      params: {
        nonprofit_uuid: nonprofit.uuid,
        slide_uuid: model.uuid
      }
    }
    return DeleteNonprofitSlide.handle(params, null, function (error, result) {
      assert(error === undefined)
      assert(result === undefined)
    })
  })

  it('should return error on exception thrown', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    sinon.stub(NonprofitSlidesRepository.prototype, 'delete').rejects('Error')
    const params = {
      params: {
        nonprofit_uuid: nonprofit.uuid,
        slide_uuid: '1234'
      }
    }
    return DeleteNonprofitSlide.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
