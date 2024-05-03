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
const GetDonation = require('../../../src/api/getDonation/index')
const DonationsRepository = require('../../../src/repositories/donations')
const TestHelper = require('../../helpers/test')

describe('GetDonation', function () {
  const donationId = 123
  const params = { donation_id: donationId }

  it('should return a donation', async function () {
    const model = await TestHelper.generate.model('donation', { id: donationId })
    sinon.stub(DonationsRepository.prototype, 'get').resolves(model)

    const result = await TestHelper.callApi(GetDonation, params)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(DonationsRepository.prototype, 'get').rejects(errorStub)

    const response = TestHelper.callApi(GetDonation, params)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
