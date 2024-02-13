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
const DeleteDonation = require('../../../src/api/deleteDonation/index')
const DonationsRepository = require('../../../src/repositories/donations')
const { callApi } = require('../../helpers/test')

const promiseMe = require('mocha-promise-me')

describe('DeleteDonation', function () {
  const donationId = '1234'

  it('should delete a donation', async function () {
    const deleteStub = sinon.stub(DonationsRepository.prototype, 'delete')

    await callApi(DeleteDonation, { donation_id: donationId })
    assert.equal(deleteStub.withArgs(donationId).callCount, 1)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('hi')
    sinon.stub(DonationsRepository.prototype, 'delete')
      .withArgs(donationId)
      .rejects(errorStub)

    const response = callApi(DeleteDonation, { donation_id: donationId })
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
