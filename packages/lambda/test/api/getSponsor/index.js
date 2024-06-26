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
const GetSponsor = require('./../../../src/api/getSponsor/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const TestHelper = require('./../../helpers/test')

describe('GetSponsor', function () {
  it('should return a sponsor', async function () {
    const sponsorTier = await TestHelper.generate.model('sponsorTier')
    const model = await TestHelper.generate.model('sponsor', { sponsorTierUuid: sponsorTier.uuid })
    sinon.stub(SponsorsRepository.prototype, 'get').resolves(model)

    const result = await TestHelper.callApi(GetSponsor)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(SponsorsRepository.prototype, 'get').rejects(errorStub)
    const response = TestHelper.callApi(GetSponsor)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
