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
const NonprofitHelper = require('../../src/helpers/nonprofit')
const Model = require('sequelize').Model
const TestHelper = require('../helpers/test')
const loadModels = require('../../src/models')
let Nonprofit

describe('Nonprofit', function () {
  beforeEach(async () => {
    Nonprofit = (await loadModels()).Nonprofit
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new Nonprofit()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of Nonprofit', function () {
      const model = new Nonprofit()
      assert.ok(model instanceof Nonprofit)
    })
  })

  describe('#populate()', function () {
    it('should generate status', function () {
      const model = new Nonprofit()
      assert.equal(model.status, 'PENDING')
    })

    it('should only allow defined attributes', function () {
      const model = new Nonprofit({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('nonprofit')
    const tests = [
      { model, param: 'address1', value: null, error: true },
      { model, param: 'address1', value: '', error: true },
      { model, param: 'address1', value: 'test', error: false },
      { model, param: 'address1', value: 123456, error: true },
      { model, param: 'address2', value: null, error: true },
      { model, param: 'address2', value: '', error: false },
      { model, param: 'address2', value: 'test', error: false },
      { model, param: 'address2', value: 123456, error: true },
      { model, param: 'category1', value: null, error: true },
      { model, param: 'category1', value: '', error: true },
      { model, param: 'category1', value: 'test', error: true },
      { model, param: 'category1', value: 123456, error: false },
      { model, param: 'category2', value: null, error: true },
      { model, param: 'category2', value: '', error: true },
      { model, param: 'category2', value: 'test', error: true },
      { model, param: 'category2', value: 123456, error: false },
      { model, param: 'category3', value: null, error: true },
      { model, param: 'category3', value: '', error: true },
      { model, param: 'category3', value: 'test', error: true },
      { model, param: 'category3', value: 123456, error: false },
      { model, param: 'city', value: null, error: true },
      { model, param: 'city', value: '', error: true },
      { model, param: 'city', value: 'test', error: false },
      { model, param: 'city', value: 123456, error: true },
      { model, param: 'email', value: null, error: true },
      { model, param: 'email', value: '', error: false },
      { model, param: 'email', value: 'test@email.com', error: false },
      { model, param: 'email', value: 'test', error: true },
      { model, param: 'email', value: 123456, error: true },
      { model, param: 'legalName', value: null, error: true },
      { model, param: 'legalName', value: '', error: true },
      { model, param: 'legalName', value: 'test', error: false },
      { model, param: 'legalName', value: 123456, error: true },
      { model, param: 'longDescription', value: null, error: true },
      { model, param: 'longDescription', value: 'test', error: false },
      { model, param: 'longDescription', value: '123456', error: false },
      { model, param: 'longDescription', value: 123456, error: true },
      { model, param: 'phone', value: null, error: true },
      { model, param: 'phone', value: '', error: false },
      { model, param: 'phone', value: 'test', error: false },
      { model, param: 'phone', value: 123456, error: false },
      { model, param: 'shortDescription', value: null, error: true },
      { model, param: 'shortDescription', value: '', error: false },
      { model, param: 'shortDescription', value: 'test', error: false },
      { model, param: 'shortDescription', value: 123456, error: true },
      { model, param: 'slug', value: null, error: true },
      { model, param: 'slug', value: '', error: false },
      { model, param: 'slug', value: 'test', error: false },
      { model, param: 'slug', value: 123456, error: true },
      { model, param: 'state', value: null, error: true },
      { model, param: 'state', value: '', error: true },
      { model, param: 'state', value: 'test', error: false },
      { model, param: 'state', value: 123456, error: true },
      { model, param: 'status', value: null, error: true },
      { model, param: 'status', value: '', error: true },
      { model, param: 'status', value: 'test', error: true },
      { model, param: 'status', value: 123456, error: true },
      { model, param: 'status', value: NonprofitHelper.STATUS_ACTIVE, error: false },
      { model, param: 'status', value: NonprofitHelper.STATUS_DENIED, error: false },
      { model, param: 'status', value: NonprofitHelper.STATUS_PENDING, error: false },
      { model, param: 'status', value: NonprofitHelper.STATUS_REVOKED, error: false },
      { model, param: 'taxId', value: null, error: true },
      { model, param: 'taxId', value: '', error: true },
      { model, param: 'taxId', value: 'test', error: false },
      { model, param: 'taxId', value: 123456, error: true },
      { model, param: 'zip', value: null, error: true },
      { model, param: 'zip', value: '', error: true },
      { model, param: 'zip', value: 'test', error: false },
      { model, param: 'zip', value: 123456, error: false }
    ]
    TestHelper.validate(tests)
  })
})
