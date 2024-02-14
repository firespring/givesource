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
const DeleteSetting = require('./../../../src/api/deleteSetting/index')
const SettingsRepository = require('./../../../src/repositories/settings')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('DeleteSetting', function () {
  it('should delete a setting', function () {
    const model = TestHelper.generate.model('setting')
    sinon.stub(SettingsRepository.prototype, 'delete').resolves(model)
    const params = {
      params: {
        key: model.key
      }
    }
    return DeleteSetting.handle(params, null, function (error, result) {
      assert(error === undefined)
      assert(result === undefined)
    })
  })

  it('should return error on exception thrown', function () {
    sinon.stub(SettingsRepository.prototype, 'delete').rejects('Error')
    const params = {
      params: {
        key: '1234'
      }
    }
    return DeleteSetting.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
