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
const PatchSetting = require('../../../src/api/patchSetting/index')
const SettingsRepository = require('./../../../src/repositories/settings')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')
const Lambda = require('../../../src/aws/lambda')

describe('PatchSetting', function () {
  it('should return an updated setting', async function () {
    const original = await TestHelper.generate.model('setting')
    const updated = await TestHelper.generate.model('setting', { uuid: original.uuid, key: original.key })
    sinon.stub(SettingsRepository.prototype, 'get').resolves(original)
    const upsertStub = sinon.stub(SettingsRepository.prototype, 'save').resolves(updated)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const result = await TestHelper.callApi(PatchSetting)
    assert(result === updated)
    assert(upsertStub.withArgs(original).callCount === 1)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)
  })

  it('should return error on exception thrown - get', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('setting')
    sinon.stub(SettingsRepository.prototype, 'get').rejects(errorStub)
    sinon.stub(SettingsRepository.prototype, 'save').resolves(original)

    const response = TestHelper.callApi(PatchSetting)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })

  it('should return error on exception thrown - save', async function () {
    const errorStub = new Error('error')
    const original = await TestHelper.generate.model('setting')
    sinon.stub(SettingsRepository.prototype, 'get').resolves(original)
    sinon.stub(SettingsRepository.prototype, 'save').rejects(errorStub)

    const response = TestHelper.callApi(PatchSetting)
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
