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
const sinon = require('sinon')
const PatchNonprofit = require('../../../src/api/patchNonprofit/index')
const NonprofitsRepository = require('../../../src/repositories/nonprofits')
const TestHelper = require('../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PatchNonprofit', function () {
  it('should return an updated nonprofit', async function () {
    const original = await TestHelper.generate.model('nonprofit')
    const updated = await TestHelper.generate.model('nonprofit', { uuid: original.uuid })
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(original)
    const upsertStub = sinon.stub(NonprofitsRepository.prototype, 'upsert').resolves(updated)
    sinon.stub(NonprofitsRepository.prototype, 'generateUniqueSlug').resolves()

    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const body = { someUpdatedParam: 'updated' }
    const result = await TestHelper.callApi(PatchNonprofit, {}, null, { body })
    assert(result === updated)
    assert(upsertStub.withArgs(original, body).callCount === 1)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
  })

  it('should return error on exception thrown - get', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('nonprofit')
    sinon.stub(NonprofitsRepository.prototype, 'get').rejects(errorStub)
    sinon.stub(NonprofitsRepository.prototype, 'upsert').resolves(original)
    sinon.stub(NonprofitsRepository.prototype, 'generateUniqueSlug').resolves()

    const response = TestHelper.callApi(PatchNonprofit)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })

  it('should return error on exception thrown - save', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('nonprofit')
    sinon.stub(NonprofitsRepository.prototype, 'get').resolves(original)
    sinon.stub(NonprofitsRepository.prototype, 'upsert').rejects(errorStub)
    sinon.stub(NonprofitsRepository.prototype, 'generateUniqueSlug').resolves()

    const response = TestHelper.callApi(PatchNonprofit)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
