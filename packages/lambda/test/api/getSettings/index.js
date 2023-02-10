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
const GetSettings = require('./../../../src/api/getSettings/index')
const SettingsRepository = require('./../../../src/repositories/settings')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('GetSettings', function () {
  afterEach(function () {
    SettingsRepository.prototype.getAll.restore()
  })

  it('should return a list of settings', function () {
    const models = TestHelper.generate.modelCollection('setting', 3)
    sinon.stub(SettingsRepository.prototype, 'getAll').resolves(models)
    return GetSettings.handle({}, null, function (error, results) {
      assert(error === null)
      assert(results.length === 3)
      results.forEach(function (result, i) {
        assert(result.uuid === models[i].uuid)
      })
    })
  })

  it('should return error on exception thrown', function () {
    sinon.stub(SettingsRepository.prototype, 'getAll').rejects('Error')
    return GetSettings.handle({}, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
