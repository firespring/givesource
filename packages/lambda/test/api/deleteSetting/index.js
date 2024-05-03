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
const Lambda = require('../../../src/aws/lambda')
const DeleteSetting = require('./../../../src/api/deleteSetting/index')
const SettingsRepository = require('./../../../src/repositories/settings')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('DeleteSetting', function () {
  const settingKey = 'SOME_SETTING'

  it('should delete a setting', async function () {
    const model = await TestHelper.generate.model('setting', { key: settingKey })
    const deleteStub = sinon.stub(SettingsRepository.prototype, 'delete').resolves(model)
    const invokeStub = sinon.stub(Lambda.prototype, 'invoke')

    const result = await TestHelper.callApi(DeleteSetting, { key: settingKey })
    assert.equal(deleteStub.withArgs(settingKey).callCount, 1)
    assert.equal(invokeStub.withArgs(sinon.match.any, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache').callCount, 1)

    assert(result === undefined)
  })

  it('should return error on exception thrown', async function () {
    const errorStub = new Error('error')
    sinon.stub(SettingsRepository.prototype, 'delete').rejects(errorStub)

    const response = TestHelper.callApi(DeleteSetting, { key: settingKey })
    await promiseMe.thatYouReject(response, (error) => {
      assert(error === errorStub)
    })
  })
})
