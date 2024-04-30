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
const PatchSponsorTier = require('../../../src/api/patchSponsorTier/index')
const sinon = require('sinon')
const SponsorTiersRepository = require('../../../src/repositories/sponsorTiers')
const TestHelper = require('../../helpers/test')

describe('PatchSponsorTier', function () {
  it('should return an updated sponsor tier', async function () {
    const original = TestHelper.generate.model('sponsorTier')
    const updated = TestHelper.generate.model('sponsorTier', { uuid: original.uuid })
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(original)
    sinon.stub(SponsorTiersRepository.prototype, 'save').resolves(updated)
    const { uuid, ...body } = updated
    const params = {
      body,
      params: {
        sponsor_tier_uuid: original.uuid
      }
    }
    return PatchSponsorTier.handle(params, null, function (error, result) {
      assert(error === null)
      assert.deepEqual(result, updated.all())
    })
  })

  it('should return error on exception thrown - get', async function () {
    const original = TestHelper.generate.model('sponsorTier')
    const params = {
      params: {
        sponsor_tier_uuid: original.uuid
      }
    }
    sinon.stub(SponsorTiersRepository.prototype, 'get').rejects('Error')
    sinon.stub(SponsorTiersRepository.prototype, 'save').resolves(original)
    return PatchSponsorTier.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })

  it('should return error on exception thrown - save', async function () {
    const original = TestHelper.generate.model('sponsorTier')
    const params = {
      params: {
        sponsor_tier_uuid: original.uuid
      }
    }
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(original)
    sinon.stub(SponsorTiersRepository.prototype, 'save').rejects('Error')
    return PatchSponsorTier.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
