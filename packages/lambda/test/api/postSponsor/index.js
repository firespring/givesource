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
const PostSponsor = require('./../../../src/api/postSponsor/index')
const sinon = require('sinon')
const SponsorsRepository = require('./../../../src/repositories/sponsors')
const TestHelper = require('./../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PostSponsor', function () {
  it('should return a sponsor', async function () {
    const sponsorTierId = 123
    const model = await TestHelper.generate.model('sponsor')
    const body = { someUpdatedParam: 'updated' }
    const populateStub = sinon.stub(SponsorsRepository.prototype, 'populate').resolves(model)
    sinon.stub(SponsorsRepository.prototype, 'getCount').resolves(1)
    sinon.stub(model, 'validate').resolves(model)
    const upsertStub = sinon.stub(SponsorsRepository.prototype, 'save').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')
    const result = await TestHelper.callApi(PostSponsor, { sponsor_tier_id: sponsorTierId }, null, { body })

    assert(populateStub.withArgs(body).callCount === 1)
    assert(upsertStub.withArgs(sponsorTierId, model).callCount === 1)
    assert(invokeStub.withArgs(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount === 1)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    const model = await TestHelper.generate.model('sponsorTier')
    sinon.stub(SponsorsRepository.prototype, 'populate').resolves(model)
    sinon.stub(model, 'validate')
    sinon.stub(SponsorsRepository.prototype, 'getCount').resolves(1)
    sinon.stub(SponsorsRepository.prototype, 'save').rejects(errorStub)

    const response = TestHelper.callApi(PostSponsor)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
