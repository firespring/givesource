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
let User

// loadModels()
describe('User', function () {
  beforeEach(async () => {
    User = (await loadModels()).User
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
    const model = () => TestHelper.generate.model('user')
    const tests = [
      { model, param: 'cognitoUuid', value: null, error: true },
      { model, param: 'cognitoUuid', value: '', error: false },
      { model, param: 'cognitoUuid', value: '123456', error: false },
      { model, param: 'cognitoUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false },
      { model, param: 'cognitoUuid', value: 123456, error: true },
      { model, param: 'email', value: null, error: true },
      { model, param: 'email', value: '', error: true },
      { model, param: 'email', value: 'test@email.com', error: false },
      { model, param: 'email', value: 'test', error: true },
      { model, param: 'email', value: 123456, error: true },
      { model, param: 'firstName', value: null, error: true },
      { model, param: 'firstName', value: '', error: false },
      { model, param: 'firstName', value: 'test', error: false },
      { model, param: 'firstName', value: 123456, error: true },
      { model, param: 'lastName', value: null, error: true },
      { model, param: 'lastName', value: '', error: false },
      { model, param: 'lastName', value: 'test', error: false },
      { model, param: 'lastName', value: 123456, error: true },

      { model, param: 'nonprofitId', value: '', error: true },
      { model, param: 'nonprofitId', value: null, error: true },
      { model, param: 'nonprofitId', value: '1234567890', error: true },
      { model, param: 'nonprofitId', value: 123, error: false }
      // cognitoUsername
    ]

    TestHelper.validate(tests)
  })
})
