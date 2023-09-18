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
let File

describe('File', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({Parameter: {Value: ''}})
    File = (await loadModels()).File
  })
  afterEach(function () {
    SecretsManager.prototype.getSecretValue.restore()
    Ssm.prototype.getParameter.restore()
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new File()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of File', function () {
      const model = new File()
      assert.ok(model instanceof File)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new File({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const tests = [
      ...TestHelper.commonModelValidations('file'),

      // TODO most/all of the commented out rules below need validation rules added
      { model: () => TestHelper.generate.model('file'), param: 'path', value: null, error: true },
      // { model: () => TestHelper.generate.model('file'), param: 'path', value: '', error: true },
      { model: () => TestHelper.generate.model('file'), param: 'path', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('file'), param: 'path', value: 123456, error: true },
      { model: () => TestHelper.generate.model('file'), param: 'filename', value: null, error: true },
      // { model: () => TestHelper.generate.model('file'), param: 'filename', value: '', error: true },
      { model: () => TestHelper.generate.model('file'), param: 'filename', value: 'test', error: false }
      // { model: () => TestHelper.generate.model('file'), param: 'filename', value: 123456, error: true }
    ]
    TestHelper.validate(tests)
  })
})
