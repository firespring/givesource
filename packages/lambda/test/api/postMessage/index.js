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
const PostMessage = require('../../../src/api/postMessage/index')
const MessagesRepository = require('../../../src/repositories/messages')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PostMessage', function () {
  it('should return a message', async function () {
    const model = {}
    const body = { someUpdatedParam: 'updated' }
    const populateStub = sinon.stub(MessagesRepository.prototype, 'populate').resolves(model)
    const upsertStub = sinon.stub(MessagesRepository.prototype, 'upsert').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')
    const result = await TestHelper.callApi(PostMessage, {}, null, { body })

    assert(populateStub.withArgs(body).callCount === 1)
    assert(upsertStub.withArgs(model, {}).callCount === 1)
    assert(invokeStub.withArgs(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendContactMessageEmail', { body: { message: model } }).callCount === 1)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(MessagesRepository.prototype, 'upsert').rejects(errorStub)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const response = TestHelper.callApi(PostMessage)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
      assert(invokeStub.callCount === 0)
    })
  })
})
