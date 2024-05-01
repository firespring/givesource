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
const PostNonprofit = require('../../../src/api/postNonprofit/index')
const NonprofitRepository = require('../../../src/repositories/nonprofits')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')

describe('PostNonprofit', function () {
  it('should return a nonprofit', function () {
    const model = TestHelper.generate.model('nonprofit')
    sinon.stub(NonprofitRepository.prototype, 'save').resolves(model)
    const { uuid, createdAt, ...body } = model
    const params = {
      body
    }
    return PostNonprofit.handle(params, null, function (error, result) {
      assert(error === null)
      TestHelper.assertModelEquals(result, model, ['uuid', 'createdAt'])
    })
  })

  it('should return error on exception thrown', function () {
    sinon.stub(NonprofitRepository.prototype, 'save').rejects('Error')
    return PostNonprofit.handle({}, null, function (error) {
      assert(error instanceof HttpException)
    })
  })
})
