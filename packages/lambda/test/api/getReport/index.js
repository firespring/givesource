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
const GetReport = require('../../../src/api/getReport/index')
const ReportsRepository = require('../../../src/repositories/reports')
const TestHelper = require('../../helpers/test')

describe('GetReport', function () {
  it('should return a report', async function () {
    const model = await TestHelper.generate.model('report')
    sinon.stub(ReportsRepository.prototype, 'get').resolves(model)

    const result = await TestHelper.callApi(GetReport)
    assert(result === model)
    // //
    // const params = {
    //   params: {
    //     reportUuid: model.uuid
    //   }
    // }
    // return GetReport.handle(params, null, function (error, result) {
    //   assert(error === null)
    //   assert.deepEqual(result, model.all())
    // })
  })

  it('should return error on exception thrown', async function () {
    sinon.stub(ReportsRepository.prototype, 'get').rejects('Error')
    const params = {
      params: {
        reportUuid: '1234'
      }
    }
    return GetReport.handle(params, null, function (error, result) {
      assert(error instanceof Error)
    })
  })
})
