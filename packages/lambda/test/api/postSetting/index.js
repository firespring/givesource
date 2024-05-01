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
const PostSetting = require('./../../../src/api/postSetting/index')
const SettingsRepository = require('./../../../src/repositories/settings')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PostSetting', function () {
  it('should return a setting', async function () {
    const model = {}
    const body = { someUpdatedParam: 'updated' }
    sinon.stub(SettingsRepository.prototype, 'populate').resolves(model)
    const upsertStub = sinon.stub(SettingsRepository.prototype, 'upsert').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const result = await TestHelper.callApi(PostSetting, {}, null, { body })

    assert(upsertStub.withArgs(model, {}).callCount === 1)
    assert(invokeStub.withArgs(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount === 1)
    assert(result === model)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(SettingsRepository.prototype, 'upsert').rejects(errorStub)

    const response = TestHelper.callApi(PostSetting)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
