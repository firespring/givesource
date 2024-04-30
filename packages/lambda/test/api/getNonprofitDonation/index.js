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
const sinon = require('sinon')
const GetNonprofitDonation = require('../../../src/api/getNonprofitDonation/index')
const NonprofitDonationsRepository = require('../../../src/repositories/nonprofitDonations')
const TestHelper = require('../../helpers/test')

describe('GetNonprofitDonation', function () {
  it('should return a donation', async function () {
    const nonprofit = await TestHelper.generate.model('nonprofit')
    const donation = await TestHelper.generate.model('donation', { nonprofitUuid: nonprofit.uuid })
    sinon.stub(NonprofitDonationsRepository.prototype, 'get').resolves(donation)

    const result = await TestHelper.callApi(GetNonprofitDonation)
    assert(result === donation)
    // //
    // const params = {
    //   params: {
    //     nonprofitUuid: nonprofit.uuid,
    //     donationUuid: donation.uuid
    //   }
    // }
    // return GetNonprofitDonation.handle(params, null, function (error, result) {
    //   assert(error === null)
    //   assert.deepEqual(result, donation.all())
    // })
  })

  it('should return error on exception thrown', async function () {
    sinon.stub(NonprofitDonationsRepository.prototype, 'get').rejects('Error')
    const params = {
      params: {
        nonprofitUuid: '1234',
        donationUuid: '1234'
      }
    }
    return GetNonprofitDonation.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })
})
