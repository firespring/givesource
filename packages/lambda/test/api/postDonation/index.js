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
const HttpException = require('./../../../src/exceptions/http')
const PostDonation = require('../../../src/api/postDonation/index')
const DonationsRepository = require('../../../src/repositories/donations')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')

describe('PostDonation', function () {
  afterEach(function () {
    DonationsRepository.prototype.save.restore()
  })

  it('should return a donation', function () {
    const model = TestHelper.generate.model('donation')
    sinon.stub(DonationsRepository.prototype, 'save').resolves(model)
    const { uuid, createdOn, ...body } = model
    const params = {
      body
    }
    return PostDonation.handle(params, null, function (error, result) {
      assert(error === null)
      TestHelper.assertModelEquals(result, model, ['uuid', 'createdOn'])
    })
  })

  it('should return error on exception thrown', function () {
    sinon.stub(DonationsRepository.prototype, 'save').rejects('Error')
    return PostDonation.handle({}, null, function (error) {
      assert(error instanceof HttpException)
    })
  })
})
