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
const PatchMessage = require('../../../src/api/patchMessage/index')
const MessagesRepository = require('../../../src/repositories/messages')
const TestHelper = require('../../helpers/test')

describe('PatchMessage', function () {
  it('should return an updated message', async function () {
    const original = await TestHelper.generate.model('message')
    const updated = await TestHelper.generate.model('message', { uuid: original.uuid })
    sinon.stub(MessagesRepository.prototype, 'get').resolves(original)
    const upsertStub = sinon.stub(MessagesRepository.prototype, 'upsert').resolves(updated)

    const body = { someUpdatedParam: 'updated' }
    const result = await TestHelper.callApi(PatchMessage, {}, null, { body })
    assert(result === updated)
    assert(upsertStub.withArgs(original, body).callCount === 1)
  })

  it('should return error on exception thrown - get', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('message')
    sinon.stub(MessagesRepository.prototype, 'get').rejects(errorStub)
    sinon.stub(MessagesRepository.prototype, 'upsert').resolves(original)

    const response = TestHelper.callApi(PatchMessage)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })

  it('should return error on exception thrown - save', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('message')
    sinon.stub(MessagesRepository.prototype, 'get').resolves(original)
    sinon.stub(MessagesRepository.prototype, 'upsert').rejects(errorStub)

    const response = TestHelper.callApi(PatchMessage)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
