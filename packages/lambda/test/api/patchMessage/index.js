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
    const original = TestHelper.generate.model('message')
    const updated = TestHelper.generate.model('message', { uuid: original.uuid })
    sinon.stub(MessagesRepository.prototype, 'get').resolves(original)
    sinon.stub(MessagesRepository.prototype, 'save').resolves(updated)
    const { uuid, ...body } = updated
    const params = {
      body,
      params: {
        messageUuid: original.uuid
      }
    }
    return PatchMessage.handle(params, null, function (error, result) {
      assert(error === null)
      assert.deepEqual(result, updated.all())
    })
  })

  it('should return error on exception thrown - get', async function () {
    const original = TestHelper.generate.model('message')
    const params = {
      params: {
        messageUuid: original.uuid
      }
    }
    sinon.stub(MessagesRepository.prototype, 'get').rejects('Error')
    sinon.stub(MessagesRepository.prototype, 'save').resolves(original)
    return PatchMessage.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })

  it('should return error on exception thrown - save', async function () {
    const original = TestHelper.generate.model('message')
    const params = {
      params: {
        messageUuid: original.uuid
      }
    }
    sinon.stub(MessagesRepository.prototype, 'get').resolves(original)
    sinon.stub(MessagesRepository.prototype, 'save').rejects('Error')
    return PatchMessage.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })
})
