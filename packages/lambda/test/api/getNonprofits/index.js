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
const sinon = require('sinon')
const GetNonprofits = require('../../../src/api/getNonprofits/index')
const NonprofitRepository = require('../../../src/repositories/nonprofits')
const TestHelper = require('../../helpers/test')
const SettingsRepository = require('../../../src/repositories/settings')

describe('GetNonprofits', function () {
  it('should return a list of nonprofits', async function () {
    const models = await TestHelper.generate.modelCollection('nonprofit', 3)
    sinon.stub(NonprofitRepository.prototype, 'countNonprofits').resolves(3)
    sinon.stub(NonprofitRepository.prototype, 'queryNonprofits').resolves(models)
    // stub SettingsRepository.get(SettingHelper.SETTING_MATCH_FUND_NONPROFIT_ID)
    sinon.stub(SettingsRepository.prototype, 'get')

    const result = await TestHelper.callApi(GetNonprofits)
    assert(result.items === models)
    // //
    // return GetNonprofits.handle({}, null, function (error, results) {
    //   assert(error === null)
    //   assert(results.length === 3)
    //   results.forEach(function (result, i) {
    //     assert(result.uuid === models[i].uuid)
    //   })
    // })
  })

  it('should return error on exception thrown', async function () {
    sinon.stub(NonprofitRepository.prototype, 'getAll').rejects('Error')
    return GetNonprofits.handle({}, null, function (error, results) {
      assert(error instanceof Error)
    })
  })
})
