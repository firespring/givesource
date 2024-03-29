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
const GetSponsors = require('./../../../src/api/getSponsors/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const TestHelper = require('./../../helpers/test')

describe('GetSponsors', function () {
  it('should return a list of nonprofit slides', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    const models = TestHelper.generate.modelCollection('sponsor', 3, { sponsorTierUuid: sponsorTier.uuid })
    sinon.stub(SponsorsRepository.prototype, 'getAll').resolves(models)
    const params = {
      params: {
        sponsor_tier_uuid: sponsorTier.uuid
      }
    }
    return GetSponsors.handle(params, null, function (error, results) {
      assert(error === null)
      assert(results.length === 3)
      results.forEach(function (result, i) {
        assert(result.uuid === models[i].uuid)
      })
    })
  })

  it('should return error on exception thrown', function () {
    const sponsorTier = TestHelper.generate.model('sponsorTier')
    sinon.stub(SponsorsRepository.prototype, 'getAll').rejects('Error')
    const params = {
      params: {
        sponsor_tier_uuid: sponsorTier.uuid
      }
    }
    return GetSponsors.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
