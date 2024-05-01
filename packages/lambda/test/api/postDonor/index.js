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
const PostDonor = require('../../../src/api/postDonor/index')
const DonorsRepository = require('../../../src/repositories/donors')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')
const Lambda = require("../../../src/aws/lambda");

describe('PostDonor', function () {
  it('should update a donor by email', async function () {
    const model = {}
    const body = { someUpdatedParam: 'updated', email: 'foo2@example.com' }
    sinon.stub(DonorsRepository.prototype, 'queryEmail').resolves(model)
    const upsertStub = sinon.stub(DonorsRepository.prototype, 'upsert').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const result = await TestHelper.callApi(PostDonor, {}, null, { body })
    assert(upsertStub.withArgs(model, body).callCount === 1)
    assert(result === model)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(DonorsRepository.prototype, 'upsert').rejects(errorStub)
    sinon.stub(Lambda.prototype, 'invoke')

    const response = TestHelper.callApi(PostDonor)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
