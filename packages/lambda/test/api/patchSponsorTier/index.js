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
const Lambda = require('../../../src/aws/lambda')

describe('PatchSponsorTier', function () {
  it('should return an updated sponsor tier', async function () {
    const original = await TestHelper.generate.model('sponsorTier')
    const updated = await TestHelper.generate.model('sponsorTier', { uuid: original.uuid })
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(original)
    const upsertStub = sinon.stub(SponsorTiersRepository.prototype, 'upsert').resolves(updated)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const body = { someUpdatedParam: 'updated' }
    const result = await TestHelper.callApi(PatchSponsorTier, {}, null, { body })
    assert(result === updated)
    assert(upsertStub.withArgs(original, body).callCount === 1)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
  })

  it('should return error on exception thrown - get', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('sponsorTier')
    sinon.stub(SponsorTiersRepository.prototype, 'get').rejects(errorStub)
    sinon.stub(SponsorTiersRepository.prototype, 'upsert').resolves(original)

    const response = TestHelper.callApi(PatchSponsorTier)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })

  it('should return error on exception thrown - save', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('sponsorTier')
    sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(original)
    sinon.stub(SponsorTiersRepository.prototype, 'upsert').rejects(errorStub)

    const response = TestHelper.callApi(PatchSponsorTier)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
