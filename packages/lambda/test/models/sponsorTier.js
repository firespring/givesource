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
const SponsorHelper = require('../../src/helpers/sponsor')
const TestHelper = require('../helpers/test')
const loadModels = require('../../src/models')
let SponsorTier

describe('SponsorTier', function () {
  beforeEach(async () => {
    SponsorTier = (await loadModels()).SponsorTier
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new SponsorTier()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of SponsorTier', function () {
      const model = new SponsorTier()
      assert.ok(model instanceof SponsorTier)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new SponsorTier({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('sponsorTier')
    const tests = [
      { model, param: 'name', value: null, error: true },
      { model, param: 'name', value: '', error: true },
      { model, param: 'name', value: 'test', error: false },
      { model, param: 'name', value: 123456, error: true },
      { model, param: 'size', value: null, error: true },
      { model, param: 'size', value: '', error: true },
      { model, param: 'size', value: 'test', error: true },
      { model, param: 'size', value: 123456, error: true },
      { model, param: 'size', value: SponsorHelper.SIZE_LARGE, error: false },
      { model, param: 'size', value: SponsorHelper.SIZE_DEFAULT, error: false },
      { model, param: 'size', value: SponsorHelper.SIZE_SMALL, error: false }
    ]
    TestHelper.validate(tests)
  })
})
