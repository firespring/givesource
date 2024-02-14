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
let Donor

describe('Donor', function () {
  beforeEach(async () => {
    Donor = (await loadModels()).Donor
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new Donor()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of Donor', function () {
      const model = new Donor()
      assert.ok(model instanceof Donor)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new Donor({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate', function () {
    const model = () => TestHelper.generate.model('donor')
    const tests = [
      { model, param: 'address1', value: null, error: true },
      { model, param: 'address1', value: '', error: false },
      { model, param: 'address1', value: 'test', error: false },
      { model, param: 'address1', value: 123456, error: true },
      { model, param: 'address2', value: null, error: true },
      { model, param: 'address2', value: '', error: false },
      { model, param: 'address2', value: 'test', error: false },
      { model, param: 'address2', value: 123456, error: true },
      { model, param: 'city', value: null, error: true },
      { model, param: 'city', value: '', error: false },
      { model, param: 'city', value: 'test', error: false },
      { model, param: 'city', value: 123456, error: true },
      { model, param: 'email', value: null, error: true },
      { model, param: 'email', value: '', error: false },
      { model, param: 'email', value: 'test@email.com', error: false },
      { model, param: 'email', value: 'test', error: true },
      { model, param: 'email', value: 123456, error: true },
      { model, param: 'firstName', value: null, error: true },
      { model, param: 'firstName', value: '', error: true },
      { model, param: 'firstName', value: 'test', error: false },
      { model, param: 'firstName', value: 123456, error: true },
      { model, param: 'lastName', value: null, error: true },
      { model, param: 'lastName', value: '', error: true },
      { model, param: 'lastName', value: 'test', error: false },
      { model, param: 'lastName', value: 123456, error: true },
      { model, param: 'phone', value: null, error: true },
      { model, param: 'phone', value: '', error: false },
      { model, param: 'phone', value: 'test', error: false },
      { model, param: 'phone', value: 123456, error: true },
      { model, param: 'state', value: null, error: true },
      { model, param: 'state', value: '', error: false },
      { model, param: 'state', value: 'test', error: false },
      { model, param: 'state', value: 123456, error: true },
      { model, param: 'zip', value: null, error: true },
      { model, param: 'zip', value: '', error: false },
      { model, param: 'zip', value: 'test', error: false },
      { model, param: 'zip', value: 123456, error: true }
    ]
    TestHelper.validate(tests)
  })
})
