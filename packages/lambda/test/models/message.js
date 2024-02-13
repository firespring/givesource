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
const Model = require('sequelize').Model
const TestHelper = require('../helpers/test')
const loadModels = require('../../src/models')
let Message

describe('Message', function () {
  beforeEach(async () => {
    Message = (await loadModels()).Message
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new Message()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of Message', function () {
      const model = new Message()
      assert.ok(model instanceof Message)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new Message({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#populate createdAt based off timezone', function () {
    const expects = [
      ['America/Boise', '8/8/2023 7:21:54 AM'],
      ['America/Chicago', '8/8/2023 8:21:54 AM'],
      [null, '8/8/2023 1:21:54 PM']
    ]
    const dateInputs = ['8/8/2023 1:21:54 PM', '2023-08-08 13:21:54']
    dateInputs.forEach(dateInput => {
      expects.forEach(([timezone, expected]) => {
        it(`Sets createdAt for "${dateInput}" in timezone: "${timezone}" to "${expected}"`, function () {
          const model = new Message({ createdAt: dateInput })

          model.timezone = timezone
          assert.equal(model.createdAt, expected)
        })
      })
    })

    it('does not error setting timezone without createdAt', function () {
      const model = new Message()
      model.timezone = 'America/Boise'
    })

    it('does not error setting null timezone without createdAt', function () {
      const model = new Message()
      model.timezone = null
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('message')
    const tests = [
      { model, param: 'email', value: null, error: true },
      { model, param: 'email', value: '', error: true },
      { model, param: 'email', value: 'test@email.com', error: false },
      { model, param: 'email', value: 'test', error: true },
      { model, param: 'email', value: 123456, error: true },
      { model, param: 'message', value: null, error: true },
      { model, param: 'message', value: '', error: true },
      { model, param: 'message', value: 'test', error: false },
      { model, param: 'message', value: 123456, error: true },
      { model, param: 'name', value: null, error: true },
      { model, param: 'name', value: '', error: true },
      { model, param: 'name', value: 'test', error: false },
      { model, param: 'name', value: 123456, error: true },
      { model, param: 'phone', value: null, error: false },
      { model, param: 'phone', value: '', error: false },
      { model, param: 'phone', value: 'test', error: false },
      { model, param: 'phone', value: 123456, error: false },
      { model, param: 'type', value: null, error: true },
      { model, param: 'type', value: 'adsf', error: true },
      { model, param: 'type', value: '', error: true },
      { model, param: 'type', value: 'CONTACT', error: false },
      { model, param: 'type', value: 'FEEDBACK', error: false }
    ]
    TestHelper.validate(tests)
  })
})
