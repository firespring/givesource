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
const sinon = require('sinon')
const GetDonor = require('../../../src/api/getDonor/index')
const DonorsRepository = require('../../../src/repositories/donors')
const TestHelper = require('../../helpers/test')

describe('GetDonor', function () {
  afterEach(function () {
    DonorsRepository.prototype.get.restore()
  })

  it('should return a donor', function () {
    const model = TestHelper.generate.model('donor')
    sinon.stub(DonorsRepository.prototype, 'get').resolves(model)
    const params = {
      params: {
        donorUuid: model.uuid // todo
      }
    }
    return GetDonor.handle(params, null, function (error, result) {
      assert(error === null)
      assert.deepEqual(result, model.all())
    })
  })

  it('should return error on exception thrown', function () {
    sinon.stub(DonorsRepository.prototype, 'get').rejects('Error')
    const params = {
      params: {
        donorUuid: '1234' // todo
      }
    }
    return GetDonor.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })
})
