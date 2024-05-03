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
const PostSponsorTier = require('../../../src/api/postSponsorTier/index')
const sinon = require('sinon')
const SponsorTiersRepository = require('../../../src/repositories/sponsorTiers')
const TestHelper = require('../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PostSponsorTier', function () {
  it('should return a sponsor tier', async function () {
    const model = await TestHelper.generate.model('sponsorTier')
    const body = { someUpdatedParam: 'updated' }
    const populateStub = sinon.stub(SponsorTiersRepository.prototype, 'populate').resolves(model)
    sinon.stub(SponsorTiersRepository.prototype, 'getCount').resolves(1)
    sinon.stub(model, 'validate').resolves(model)
    const upsertStub = sinon.stub(SponsorTiersRepository.prototype, 'upsert').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')
    const result = await TestHelper.callApi(PostSponsorTier, {}, null, { body })

    assert(populateStub.withArgs(body).callCount === 1)
    assert(upsertStub.withArgs(model, {}).callCount === 1)
    assert(invokeStub.withArgs(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount === 1)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    const model = await TestHelper.generate.model('sponsorTier')
    const errorStub = new Error('error')
    sinon.stub(SponsorTiersRepository.prototype, 'populate').resolves(model)
    sinon.stub(model, 'validate').resolves(model)
    sinon.stub(SponsorTiersRepository.prototype, 'getCount').resolves(1)
    sinon.stub(SponsorTiersRepository.prototype, 'upsert').rejects(errorStub)

    const response = TestHelper.callApi(PostSponsorTier)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
