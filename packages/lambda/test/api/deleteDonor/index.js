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
const DeleteDonor = require('../../../src/api/deleteDonor/index')
const DonorsRepository = require('../../../src/repositories/donors')
const TestHelper = require('../../helpers/test')

describe('DeleteDonor', function () {
  const donorId = 123

  it('should delete a donor', async function () {
    const model = await TestHelper.generate.model('donor', { id: donorId })
    const deleteStub = sinon.stub(DonorsRepository.prototype, 'delete').resolves(model)
    const result = await TestHelper.callApi(DeleteDonor, { donor_id: donorId })
    assert.equal(deleteStub.withArgs(model.id).callCount, 1)
    assert(result === undefined)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(DonorsRepository.prototype, 'delete').rejects(errorStub)

    const response = TestHelper.callApi(DeleteDonor, { donor_id: donorId })
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
