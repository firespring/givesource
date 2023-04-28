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
const NonprofitsRepository = require('./../../../src/repositories/nonprofits')
const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
const PatchNonprofitSlide = require('./../../../src/api/patchNonprofitSlide/index')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('PatchNonprofitSlide', function () {
  afterEach(function () {
    NonprofitsRepository.prototype.get.restore()
    NonprofitSlidesRepository.prototype.get.restore()
    NonprofitSlidesRepository.prototype.save.restore()
  })

  it('should return an updated nonprofit slide', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    const original = TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
    const updated = TestHelper.generate.model('nonprofitSlide', { uuid: original.uuid, nonprofitUuid: nonprofit.uuid })
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(original)
    sinon.stub(NonprofitSlidesRepository.prototype, 'save').resolves(updated)
    const { uuid, ...body } = updated
    const params = {
      body,
      params: {
        nonprofitUuid: nonprofit.uuid,
        slideUuid: original.uuid
      }
    }
    return PatchNonprofitSlide.handle(params, null, function (error, result) {
      assert(error === null)
      assert.deepEqual(result, updated.all())
    })
  })

  it('should return error on exception thrown - get', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    const original = TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
    const params = {
      params: {
        nonprofitUuid: nonprofit.uuid,
        slideUuid: original.uuid
      }
    }
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    sinon.stub(NonprofitSlidesRepository.prototype, 'get').rejects('Error')
    sinon.stub(NonprofitSlidesRepository.prototype, 'save').resolves(original)
    return PatchNonprofitSlide.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })

  it('should return error on exception thrown - save', function () {
    const nonprofit = TestHelper.generate.model('nonprofit')
    const original = TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
    const params = {
      params: {
        nonprofitUuid: nonprofit.uuid,
        slideUuid: original.uuid
      }
    }
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(original)
    sinon.stub(NonprofitSlidesRepository.prototype, 'save').rejects('Error')
    return PatchNonprofitSlide.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })
})
