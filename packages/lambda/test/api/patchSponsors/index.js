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
const PatchSponsors = require('./../../../src/api/patchSponsors/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers')
const TestHelper = require('./../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PatchSponsors', function () {
  it('should return an updated sponsor', async function () {
    const sponsorTier = await TestHelper.generate.model('sponsorTier')
    const models = await TestHelper.generate.modelCollection('sponsor', 3, { sponsorTierUuid: sponsorTier.uuid })
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'populate').resolvesArg(0)
    const upsertStub = sinon.stub(SponsorsRepository.prototype, 'upsert').resolves()
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    await TestHelper.callApi(PatchSponsors, {}, null, { body: { sponsors: models } })
    assert(upsertStub.callCount === models.length)
    models.forEach(model => assert(upsertStub.withArgs(model, sinon.match.any).callCount === 1))
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
  })

  it('should return error on exception thrown - batchSave', async function () {
    const sponsorTier = await TestHelper.generate.model('sponsorTier')
    const models = await TestHelper.generate.modelCollection('sponsor', 3, { sponsorTierUuid: sponsorTier.uuid })
    const params = {
      body: {
        sponsors: models
      },
      params: {
        sponsor_tier_uuid: sponsorTier.uuid
      }
    }
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'batchSave').rejects('Error')
    return PatchSponsors.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
