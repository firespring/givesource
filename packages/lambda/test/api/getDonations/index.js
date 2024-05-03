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
const GetDonations = require('../../../src/api/getDonations/index')
const DonationsRepository = require('../../../src/repositories/donations')
const TestHelper = require('../../helpers/test')
const SettingsRepository = require('../../../src/repositories/settings')

describe('GetDonations', function () {
  it('should return a list of donations', async function () {
    const models = await TestHelper.generate.modelCollection('donation', 3)
    sinon.stub(DonationsRepository.prototype, 'queryDonations').resolves({
      count: models.length,
      rows: models
    })

    // SETTING_TEST_PAYMENTS_DISPLAY
    const displayPaymentsResponse = { value: 0 }
    sinon.stub(SettingsRepository.prototype, 'get').resolves(displayPaymentsResponse)

    const result = await TestHelper.callApi(GetDonations)
    assert(result.total === models.length)
    assert(result.items === models)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(DonationsRepository.prototype, 'queryDonations').rejects(errorStub)

    // SETTING_TEST_PAYMENTS_DISPLAY
    const displayPaymentsResponse = { value: 0 }
    sinon.stub(SettingsRepository.prototype, 'get').resolves(displayPaymentsResponse)

    // suppress console.log(err) DonationsRepository.queryDonations catch
    sinon.stub(console, 'log').withArgs(errorStub)

    const response = TestHelper.callApi(GetDonations)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
