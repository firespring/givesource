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
const PostNonprofit = require('../../../src/api/postNonprofit/index')
const NonprofitRepository = require('../../../src/repositories/nonprofits')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PostNonprofit', function () {
  it('should return a nonprofit', async function () {
    const model = await TestHelper.generate.model('nonprofit')
    const body = { someUpdatedParam: 'updated' }

    const upsertStub = sinon.stub(NonprofitRepository.prototype, 'upsert').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')
    sinon.stub(NonprofitRepository.prototype, 'populate').resolves(model)
    sinon.stub(model, 'validate')

    const result = await TestHelper.callApi(PostNonprofit, {}, null, { body })

    assert(result === model)
    assert(upsertStub.withArgs(model).callCount === 1)
    assert(invokeStub.withArgs(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount === 1)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    const model = await TestHelper.generate.model('nonprofit')

    sinon.stub(NonprofitRepository.prototype, 'upsert').rejects(errorStub)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')
    sinon.stub(NonprofitRepository.prototype, 'populate').resolves(model)
    sinon.stub(model, 'validate')

    const response = TestHelper.callApi(PostNonprofit)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
      assert(invokeStub.callCount === 0)
    })
  })
})
