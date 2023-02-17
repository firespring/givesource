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
const PatchSponsor = require('./../../../src/api/patchSponsor/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers')
const TestHelper = require('./../../helpers/test')

describe('PatchSponsor', function () {
  afterEach(function () {
    SponsorTiersRepository.prototype.get.restore()
    SponsorsRepository.prototype.get.restore()
    SponsorsRepository.prototype.save.restore()
  })

  it('should return an updated sponsor', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    const original = TestHelper.generate.model('sponsor', { sponsorTierUuid: sponsorTier.uuid })
    const updated = TestHelper.generate.model('sponsor', { uuid: original.uuid, sponsorTierUuid: sponsorTier.uuid })
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'get').resolves(original)
    sinon.stub(SponsorsRepository.prototype, 'save').resolves(updated)
    const { uuid, ...body } = updated
    const params = {
      body,
      params: {
        sponsor_tier_uuid: sponsorTier.uuid,
        sponsor_uuid: original.uuid
      }
    }
    return PatchSponsor.handle(params, null, function (error, result) {
      assert(error === null)
      assert.deepEqual(result, updated.all())
    })
  })

  it('should return error on exception thrown - get', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    const original = TestHelper.generate.model('sponsor', { sponsorTierUuid: sponsorTier.uuid })
    const params = {
      params: {
        sponsor_tier_uuid: sponsorTier.uuid,
        sponsor_uuid: original.uuid
      }
    }
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'get').rejects('Error')
    sinon.stub(SponsorsRepository.prototype, 'save').resolves(original)
    return PatchSponsor.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })

  it('should return error on exception thrown - save', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    const original = TestHelper.generate.model('sponsor', { sponsorTierUuid: sponsorTier.uuid })
    const params = {
      params: {
        sponsor_tier_uuid: sponsorTier.uuid,
        sponsor_uuid: original.uuid
      }
    }
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'get').resolves(original)
    sinon.stub(SponsorsRepository.prototype, 'save').rejects('Error')
    return PatchSponsor.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
