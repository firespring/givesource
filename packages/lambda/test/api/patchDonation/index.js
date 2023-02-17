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
const sinon = require('sinon')
const PatchDonation = require('../../../src/api/patchDonation/index')
const DonationsRepository = require('../../../src/repositories/donations')
const TestHelper = require('../../helpers/test')

describe('PatchDonation', function () {
  afterEach(function () {
    DonationsRepository.prototype.get.restore()
    DonationsRepository.prototype.save.restore()
  })

  it('should return an updated donation', function () {
    const original = TestHelper.generate.model('donation')
    const updated = TestHelper.generate.model('donation', { uuid: original.uuid })
    sinon.stub(DonationsRepository.prototype, 'get').resolves(original)
    sinon.stub(DonationsRepository.prototype, 'save').resolves(updated)
    const { uuid, ...body } = updated
    const params = {
      body,
      params: {
        donationUuid: original.uuid
      }
    }
    return PatchDonation.handle(params, null, function (error, result) {
      assert(error === null)
      assert.deepEqual(result, updated.all())
    })
  })

  it('should return error on exception thrown - get', function () {
    const original = TestHelper.generate.model('donation')
    const params = {
      params: {
        donationUuid: original.uuid
      }
    }
    sinon.stub(DonationsRepository.prototype, 'get').rejects('Error')
    sinon.stub(DonationsRepository.prototype, 'save').resolves(original)
    return PatchDonation.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })

  it('should return error on exception thrown - save', function () {
    const original = TestHelper.generate.model('donation')
    const params = {
      params: {
        donationUuid: original.uuid
      }
    }
    sinon.stub(DonationsRepository.prototype, 'get').resolves(original)
    sinon.stub(DonationsRepository.prototype, 'save').rejects('Error')
    return PatchDonation.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })
})
