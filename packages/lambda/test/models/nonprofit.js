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
const SecretsManager = require('../../src/aws/secretsManager')
const loadModels = require('../../src/models')
const sinon = require('sinon')
let Nonprofit

describe('Nonprofit', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    Nonprofit = (await loadModels()).Nonprofit
  })
  afterEach(function () {
    SecretsManager.prototype.getSecretValue.restore()
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
    const tests = [
      ...TestHelper.commonModelValidations('nonprofit'),

      // TODO most/all of the commented out rules below need validation rules added
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address1', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'address1', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address1', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'address1', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'address2', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address2', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address2', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'address2', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address3', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address3', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'address3', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'address3', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'category1', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'category1', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'category1', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'category1', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'category2', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'category2', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'category2', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'category2', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'category3', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'category3', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'category3', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'category3', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'city', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'city', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'city', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'city', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'legalName', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'legalName', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'legalName', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'legalName', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'longDescription', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'longDescription', value: 'test', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'longDescription', value: '123456', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'longDescription', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'phone', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'phone', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'phone', value: 'test', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'phone', value: 123456, error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'slug', value: null, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'slug', value: '', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'slug', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'slug', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'state', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'state', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'state', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'state', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: '', error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: 'test', error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_ACTIVE, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_DENIED, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_PENDING, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_REVOKED, error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'taxId', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'taxId', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'taxId', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'taxId', value: 123456, error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'zip', value: null, error: true },
      // { model: () => TestHelper.generate.model('nonprofit'), param: 'zip', value: '', error: true },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'zip', value: 'test', error: false },
      { model: () => TestHelper.generate.model('nonprofit'), param: 'zip', value: 123456, error: false }
    ]
    TestHelper.validate(tests)
  })
})
