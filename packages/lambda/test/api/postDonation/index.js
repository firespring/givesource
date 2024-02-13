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

const Request = require('../../../src/aws/request')
const SecretsManager = require('../../../src/aws/secretsManager')
const Ssm = require('../../../src/aws/ssm')

describe('PostDonation', function () {
  // beforeEach(async () => {
  //   sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
  //   sinon.stub(Ssm.prototype, 'getParameter').resolves({ Parameter: { Value: '' } })
  // })
  // afterEach(function () {
  //   // SecretsManager.prototype.getSecretValue.restore()
  //   // Ssm.prototype.getParameter.restore()
  //
  //   sinon.restore();
  // })
  // afterEach(function () {
  //   // DonationsRepository.prototype.upsert.restore()
  //   // DonationsRepository.prototype.populate.restore()
  //   // Request.prototype.validate.restore()
  // })

  it('should return a donation', async function () {
    const model = await TestHelper.generate.model('donation')
    // console.log({model})
    sinon.stub(DonationsRepository.prototype, 'upsert').resolves(model)
    sinon.stub(DonationsRepository.prototype, 'populate').resolves(model)

    sinon.stub(Request.prototype, 'validate').resolves(true)

    const { uuid, createdAt, ...body } = model
    const params = {
      body
    }

    // const result = await new Promise(resolve => PostDonation.handle(params, null, ))

    return new Promise(resolve => {
      PostDonation.handle(params, null, function (error, result) {
        console.log('PostDonation.handle callback', error)
        assert(!error)
        assert(result === model)
        // TestHelper.assertModelEquals(result, model, ['uuid', 'createdAt'])
        // assert(false)
        // TestHelper.assertModelEquals({foo: 'bar'}, model, [])
        resolve()
      })
    })
  })

  it('should return error on exception thrown', function () {
    // DonationsRepository.prototype.upsert.restore()

    sinon.stub(DonationsRepository.prototype, 'save').rejects('Error')
    return PostDonation.handle({}, null, function (error) {
      assert(error instanceof HttpException)
    })
  })
})
