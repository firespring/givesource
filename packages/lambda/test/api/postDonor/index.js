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
const PostDonor = require('../../../src/api/postDonor/index')
const DonorsRepository = require('../../../src/repositories/donors')
const sinon = require('sinon')
const TestHelper = require('../../helpers/test')

describe('PostDonor', function () {
  it('should update a donor by email', function () {
    const data = TestHelper.generate.model('donor')
    // const donor = TestHelper.generate.model('donor', { email: data.email })
    sinon.stub(DonorsRepository.prototype, 'queryEmail').resolves(data)
    sinon.stub(DonorsRepository.prototype, 'save').resolves(data)
    const { uuid, createdAt, ...body } = data
    const params = {
      body
    }
    return PostDonor.handle(params, null, function (error, result) {
      assert(error === null)
      TestHelper.assertModelEquals(result, data, ['uuid', 'createdAt'])
    })
  })

  it('should return error on exception thrown', function () {
    const data = TestHelper.generate.model('donor')
    sinon.stub(DonorsRepository.prototype, 'queryEmail').resolves(data)
    sinon.stub(DonorsRepository.prototype, 'save').rejects('Error')
    return PostDonor.handle({}, null, function (error) {
      assert(error instanceof HttpException)
    })
  })
})
