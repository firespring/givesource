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
const promiseMe = require('mocha-promise-me')
const HttpException = require('./../../../src/exceptions/http')
const PostDonation = require('../../../src/api/postDonation/index')
const DonationsRepository = require('../../../src/repositories/donations')
const { callApi } = require('../../helpers/test')

describe('PostDonation', function () {
  it('should return a donation', async function () {
    const model = {}
    sinon.stub(DonationsRepository.prototype, 'upsert').resolves(model)

    const result = await callApi(PostDonation)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    sinon.stub(DonationsRepository.prototype, 'upsert').rejects(new HttpException())
    await promiseMe.thatYouReject(callApi(PostDonation), (error) => {
      assert(error instanceof HttpException)
    })
  })
})
