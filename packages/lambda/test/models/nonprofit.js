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
const Model = require('../../src/dynamo-models/model')
const Nonprofit = require('../../src/dynamo-models/nonprofit')
const NonprofitHelper = require('../../src/helpers/nonprofit')
const TestHelper = require('../helpers/test')

describe('Nonprofit', function () {
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
    it('should generate donationsCount', function () {
      const model = new Nonprofit()
      assert.equal(model.donationsCount, 0)
    })

    it('should generate donationsFees', function () {
      const model = new Nonprofit()
      assert.equal(model.donationsFees, 0)
    })

    it('should generate donationsFeesCovered', function () {
      const model = new Nonprofit()
      assert.equal(model.donationsFeesCovered, 0)
    })

    it('should generate donationsSubtotal', function () {
      const model = new Nonprofit()
      assert.equal(model.donationsSubtotal, 0)
    })

    it('should generate donationsTotal', function () {
      const model = new Nonprofit()
      assert.equal(model.donationsTotal, 0)
    })

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
      { model: TestHelper.generate.model('nonprofit'), param: 'uuid', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'uuid', value: '1234567890', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: '123456', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'createdOn', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'isDeleted', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'isDeleted', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'isDeleted', value: '123456', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'isDeleted', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'isDeleted', value: 0, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'isDeleted', value: 1, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address1', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'address1', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'address1', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address1', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'address2', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address2', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address2', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address2', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'address3', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address3', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address3', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'address3', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'category1', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'category1', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'category1', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category1', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'category2', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category2', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category2', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category2', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'category3', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category3', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category3', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'category3', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'city', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'city', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'city', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'city', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsCount', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFees', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFees', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFees', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFees', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFeesCovered', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFeesCovered', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFeesCovered', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsFeesCovered', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsSubtotal', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsSubtotal', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsSubtotal', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsSubtotal', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsTotal', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsTotal', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsTotal', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'donationsTotal', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'legalName', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: '123456', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'longDescription', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'phone', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'phone', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'phone', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'phone', value: 123456, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'shortDescription', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'slug', value: null, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'slug', value: '', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'slug', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'slug', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'state', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'state', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'state', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'state', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: 'test', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_ACTIVE, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_DENIED, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_PENDING, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'status', value: NonprofitHelper.STATUS_REVOKED, error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'taxId', value: 123456, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'zip', value: null, error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'zip', value: '', error: true },
      { model: TestHelper.generate.model('nonprofit'), param: 'zip', value: 'test', error: false },
      { model: TestHelper.generate.model('nonprofit'), param: 'zip', value: 123456, error: false }
    ]
    TestHelper.validate(tests)
  })
})
