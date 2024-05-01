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
const HttpException = require('./../../../src/exceptions/http')
const PostMessage = require('../../../src/api/postMessage/index')
const MessagesRepository = require('../../../src/repositories/messages')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')

describe('PostMessage', function () {
  it('should return a message', function () {
    const model = TestHelper.generate.model('message')
    sinon.stub(MessagesRepository.prototype, 'save').resolves(model)
    const { uuid, createdAt, ...body } = model
    const params = {
      body
    }
    return PostMessage.handle(params, null, function (error, result) {
      assert(error === null)
      TestHelper.assertModelEquals(result, model, ['uuid', 'createdAt'])
    })
  })

  it('should return error on exception thrown', function () {
    sinon.stub(MessagesRepository.prototype, 'save').rejects('Error')
    return PostMessage.handle({}, null, function (error) {
      assert(error instanceof HttpException)
    })
  })
})
