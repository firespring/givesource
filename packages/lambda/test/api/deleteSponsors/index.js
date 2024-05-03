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
const DeleteSponsors = require('./../../../src/api/deleteSponsors/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const TestHelper = require('./../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('DeleteSponsors', function () {
  const sponsorTierId = 123

  it('should delete a sponsor', async function () {
    const sponsorTier = await TestHelper.generate.model('sponsorTier', { id: sponsorTierId })
    const models = await TestHelper.generate.modelCollection('sponsor', 3, { sponsorTierTd: sponsorTier.id })
    sinon.stub(SponsorsRepository.prototype, 'get')
      .onCall(0).resolves(models[0])
      .onCall(1).resolves(models[1])
      .onCall(2).resolves(models[2])
    const deleteStub = sinon.stub(SponsorsRepository.prototype, 'bulkDelete').resolves()
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const result = await TestHelper.callApi(DeleteSponsors, { sponsor_tier_id: sponsorTierId }, null, { body: { sponsors: models } })
    assert.equal(deleteStub.withArgs(
      sinon.match.array.deepEquals(models)
    ).callCount, 1)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
    assert(result === undefined)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(SponsorsRepository.prototype, 'bulkDelete').rejects(errorStub)

    const response = TestHelper.callApi(DeleteSponsors, { sponsor_tier_id: sponsorTierId })
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
