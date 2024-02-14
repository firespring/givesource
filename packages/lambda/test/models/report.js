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
const ReportHelper = require('../../src/helpers/report')
const Model = require('sequelize').Model
const TestHelper = require('../helpers/test')
const loadModels = require('../../src/models')
let Report

describe('Report', function () {
  beforeEach(async () => {
    Report = (await loadModels()).Report
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new Report()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of Report', function () {
      const model = new Report()
      assert.ok(model instanceof Report)
    })
  })

  describe('#populate()', function () {
    it('should generate status', function () {
      const model = new Report()
      assert.equal(model.status, 'PENDING')
    })

    it('should only allow defined attributes', function () {
      const model = new Report({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('report')
    const tests = [
      { model, param: 'status', value: null, error: true },
      { model, param: 'status', value: '', error: true },
      { model, param: 'status', value: 'test', error: true },
      { model, param: 'status', value: 123456, error: true },
      { model, param: 'status', value: ReportHelper.STATUS_FAILED, error: false },
      { model, param: 'status', value: ReportHelper.STATUS_PENDING, error: false },
      { model, param: 'status', value: ReportHelper.STATUS_SUCCESS, error: false },
      { model, param: 'type', value: null, error: true },
      { model, param: 'type', value: 'test', error: true },
      { model, param: 'type', value: '', error: true },
      { model, param: 'type', value: ReportHelper.TYPE_DONATIONS, error: false },
      { model, param: 'type', value: ReportHelper.TYPE_PAYOUT_REPORT, error: false },
      { model, param: 'type', value: ReportHelper.TYPE_LAST_4, error: false }
    ]
    TestHelper.validate(tests)
  })
})
