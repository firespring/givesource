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
const NonprofitSlideHelper = require('../../src/helpers/nonprofitSlide')
const Model = require('sequelize').Model
const TestHelper = require('../helpers/test')
const SecretsManager = require('../../src/aws/secretsManager')
const Ssm = require('../../src/aws/ssm')
const loadModels = require('../../src/models')
const sinon = require('sinon')
let NonprofitSlide

describe('NonprofitSlide', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({ Parameter: { Value: '' } })
    NonprofitSlide = (await loadModels()).NonprofitSlide
  })
  afterEach(function () {
    SecretsManager.prototype.getSecretValue.restore()
    Ssm.prototype.getParameter.restore()
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new NonprofitSlide()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of NonprofitSlide', function () {
      const model = new NonprofitSlide()
      assert.ok(model instanceof NonprofitSlide)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new NonprofitSlide({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('nonprofitSlide')
    const tests = [
      ...TestHelper.commonModelValidations('nonprofitSlide'),

      { model, param: 'caption', value: null, error: true },
      { model, param: 'caption', value: '', error: false },
      { model, param: 'caption', value: 'test', error: false },
      { model, param: 'caption', value: 123456, error: true },
      { model, param: 'nonprofitId', value: null, error: true },
      { model, param: 'nonprofitId', value: '1234567890', error: true },
      { model, param: 'nonprofitId', value: 123, error: false },
      { model, param: 'sortOrder', value: null, error: true },
      { model, param: 'sortOrder', value: '', error: true },
      { model, param: 'sortOrder', value: 'test', error: true },
      { model, param: 'sortOrder', value: 123456, error: false },
      { model, param: 'type', value: null, error: true },
      { model, param: 'type', value: 'adsf', error: true },
      { model, param: 'type', value: '', error: true },
      { model, param: 'type', value: NonprofitSlideHelper.TYPE_IMAGE, error: false },
      { model, param: 'type', value: NonprofitSlideHelper.TYPE_VIMEO, error: false },
      { model, param: 'type', value: NonprofitSlideHelper.TYPE_YOUTUBE, error: false },
      { model, param: 'url', value: null, error: true },
      { model, param: 'url', value: '', error: false },
      { model, param: 'url', value: 'http://test.com/image.jpg', error: false },
      { model, param: 'url', value: 123456, error: true }
    ]
    TestHelper.validate(tests)
  })
})
