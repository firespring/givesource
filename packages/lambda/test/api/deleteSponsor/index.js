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
const DeleteSponsor = require('./../../../src/api/deleteSponsor/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers')
const TestHelper = require('./../../helpers/test')

describe('DeleteSponsor', function () {
  afterEach(function () {
    SponsorTiersRepository.prototype.get.restore()
    SponsorsRepository.prototype.delete.restore()
  })

  it('should delete a sponsor', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    const model = TestHelper.generate.model('sponsor')
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'delete').resolves(model)
    const params = {
      params: {
        sponsor_tier_uuid: sponsorTier.uuid,
        sponsor_uuid: model.uuid
      }
    }
    return DeleteSponsor.handle(params, null, function (error, result) {
      assert(error === undefined)
      assert(result === undefined)
    })
  })

  it('should return error on exception thrown', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
    sinon.stub(SponsorsRepository.prototype, 'delete').rejects('Error')
    const params = {
      params: {
        sponsor_tier_uuid: sponsorTier.uuid,
        sponsor_uuid: '1234'
      }
    }
    return DeleteSponsor.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
