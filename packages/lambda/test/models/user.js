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
const sinon = require('sinon')
const TestHelper = require('../helpers/test')
const loadModels = require('../../src/models')
const SecretsManager = require('../../src/aws/secretsManager')
const Ssm = require('../../src/aws/ssm')
let User

// loadModels()
describe('User', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({Parameter: {Value: ''}})
    User = (await loadModels()).User
  })
  afterEach(function () {
    SecretsManager.prototype.getSecretValue.restore()
    Ssm.prototype.getParameter.restore()
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new User()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of User', function () {
      const model = new User()
      assert.ok(model instanceof User)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new User({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const tests = [
      ...TestHelper.commonModelValidations('user'),

      // TODO most/all of the commented out rules below need validation rules added
      // { model: () => TestHelper.generate.model('user'), param: 'cognitoUuid', value: null, error: false },
      { model: () => TestHelper.generate.model('user'), param: 'cognitoUuid', value: '', error: false },
      // { model: () => TestHelper.generate.model('user'), param: 'cognitoUuid', value: '123456', error: true },
      { model: () => TestHelper.generate.model('user'), param: 'cognitoUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false },
      // { model: () => TestHelper.generate.model('user'), param: 'cognitoUuid', value: 123456, error: true },
      { model: () => TestHelper.generate.model('user'), param: 'email', value: null, error: true },
      // { model: () => TestHelper.generate.model('user'), param: 'email', value: '', error: true },
      { model: () => TestHelper.generate.model('user'), param: 'email', value: 'test@email.com', error: false },
      // { model: () => TestHelper.generate.model('user'), param: 'email', value: 'test', error: true },
      // { model: () => TestHelper.generate.model('user'), param: 'email', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('user'), param: 'firstName', value: null, error: false },
      { model: () => TestHelper.generate.model('user'), param: 'firstName', value: '', error: false },
      { model: () => TestHelper.generate.model('user'), param: 'firstName', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('user'), param: 'firstName', value: 123456, error: true },
      // { model: () => TestHelper.generate.model('user'), param: 'lastName', value: null, error: false },
      { model: () => TestHelper.generate.model('user'), param: 'lastName', value: '', error: false },
      { model: () => TestHelper.generate.model('user'), param: 'lastName', value: 'test', error: false },
      // { model: () => TestHelper.generate.model('user'), param: 'lastName', value: 123456, error: true },
      { model: () => TestHelper.generate.model('user'), param: 'nonprofitUuid', value: '', error: false },
      { model: () => TestHelper.generate.model('user'), param: 'nonprofitUuid', value: null, error: false },
      // { model: () => TestHelper.generate.model('user'), param: 'nonprofitUuid', value: '1234567890', error: true },
      { model: () => TestHelper.generate.model('user'), param: 'nonprofitUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false }
      // cognitoUsername
    ]

    TestHelper.validate(tests)
  })
})
