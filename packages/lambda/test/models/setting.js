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
const SecretsManager = require('../../src/aws/secretsManager')
const Ssm = require('../../src/aws/ssm')
const loadModels = require('../../src/models')
const sinon = require('sinon')
let Setting

describe('Setting', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({ Parameter: { Value: '' } })
    Setting = (await loadModels()).Setting
  })
  afterEach(function () {
    SecretsManager.prototype.getSecretValue.restore()
    Ssm.prototype.getParameter.restore()
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new Setting()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of Setting', function () {
      const model = new Setting()
      assert.ok(model instanceof Setting)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new Setting({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('setting')
    const tests = [
      ...TestHelper.commonModelValidations('setting'),

      { model, param: 'key', value: null, error: true },
      { model, param: 'key', value: '', error: true },
      { model, param: 'key', value: 'test', error: false },
      { model, param: 'key', value: 123456, error: true },
      { model, param: 'value', value: null, error: false },
      { model, param: 'value', value: '', error: false },
      { model, param: 'value', value: 'test', error: false },
      { model, param: 'value', value: 123456, error: false }
    ]
    TestHelper.validate(tests)
  })
})
