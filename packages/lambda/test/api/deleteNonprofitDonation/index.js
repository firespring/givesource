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
const DeleteNonprofitDonation = require('../../../src/api/deleteNonprofitDonation/index')
const NonprofitsRepository = require('../../../src/repositories/nonprofits')
const NonprofitDonationsRepository = require('../../../src/repositories/nonprofitDonations')
const TestHelper = require('../../helpers/test')

describe('DeleteNonprofitDonation', function () {
  const nonprofitId = 123
  const donationId = 456

  it('should delete a nonprofit', async function () {
    const nonprofit = await TestHelper.generate.model('nonprofit', { id: nonprofitId })
    const model = await TestHelper.generate.model('donation', { id: donationId })
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    const deleteStub = sinon.stub(NonprofitDonationsRepository.prototype, 'delete').resolves(model)

    const result = await TestHelper.callApi(DeleteNonprofitDonation, { nonprofit_id: nonprofitId, donation_id: donationId })
    assert.equal(deleteStub.withArgs(nonprofit.id, model.id).callCount, 1)
    assert(result === undefined)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    const nonprofit = await TestHelper.generate.model('nonprofit')
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
    sinon.stub(NonprofitDonationsRepository.prototype, 'delete').rejects(errorStub)

    const response = TestHelper.callApi(DeleteNonprofitDonation, { nonprofit_id: nonprofitId, donation_id: donationId })
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
