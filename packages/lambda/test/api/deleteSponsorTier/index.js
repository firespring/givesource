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
const DeleteSponsorTier = require('./../../../src/api/deleteSponsorTier/index')
const sinon = require('sinon')
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers')
const TestHelper = require('../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('DeleteSponsorTier', function () {
  const sponsorTierId = 123

  it('should delete a sponsor tier', async function () {
    const model = await TestHelper.generate.model('sponsorTier', { id: sponsorTierId })
    const deleteStub = sinon.stub(SponsorTiersRepository.prototype, 'delete').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const result = await TestHelper.callApi(DeleteSponsorTier, { sponsor_tier_id: sponsorTierId })
    assert.equal(deleteStub.withArgs(model.id).callCount, 1)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
    assert(result === undefined)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(SponsorTiersRepository.prototype, 'delete').rejects(errorStub)

    const response = TestHelper.callApi(DeleteSponsorTier, { sponsor_tier_id: sponsorTierId })
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
