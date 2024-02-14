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
let Donation

describe('Donation', function () {
  beforeEach(async () => {
    Donation = (await loadModels()).Donation
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new Donation()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of Donation', function () {
      const model = new Donation()
      assert.ok(model instanceof Donation)
    })
  })

  describe('#populate()', function () {
    it('should generate isFeeCovered', function () {
      const model = new Donation()
      assert.equal(model.isFeeCovered, false)
    })

    it('should generate isOfflineDonation', function () {
      const model = new Donation()
      assert.equal(model.isOfflineDonation, false)
    })

    it('should only allow defined attributes', function () {
      const model = new Donation({ test1: 123, test2: 'test', test3: true })
      assert.equal(model.test1, undefined)
      assert.equal(model.test2, undefined)
      assert.equal(model.test3, undefined)
    })
  })

  describe('#populate createdAt based off timezone', function () {
    const expects = [
      ['America/Boise', '8/8/2023 7:21:54 AM'],
      ['America/Chicago', '8/8/2023 8:21:54 AM'],
      [null, '8/8/2023 1:21:54 PM']
    ]
    const dateInputs = ['8/8/2023 1:21:54 PM', '2023-08-08 13:21:54']
    dateInputs.forEach(dateInput => {
      expects.forEach(([timezone, expected]) => {
        it(`Sets createdAt for "${dateInput}" in timezone: "${timezone}" to "${expected}"`, function () {
          const model = new Donation({ createdAt: dateInput })

          model.timezone = timezone
          assert.equal(model.createdAt, expected)
        })
      })
    })

    it('does not error setting timezone without createdAt', function () {
      const model = new Donation()
      model.timezone = 'America/Boise'
    })

    it('does not error setting null timezone without createdAt', function () {
      const model = new Donation()
      model.timezone = null
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('donation')
    const tests = [
      { model, param: 'subtotal', value: null, error: true },
      { model, param: 'subtotal', value: '', error: true },
      { model, param: 'subtotal', value: '123456', error: true },
      { model, param: 'subtotal', value: 123456, error: false },
      { model, param: 'donorId', value: null, error: true },
      { model, param: 'donorId', value: 1234567890, error: false },
      { model, param: 'donorId', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: true },
      { model, param: 'fees', value: null, error: true },
      { model, param: 'fees', value: '', error: true },
      { model, param: 'fees', value: '123456', error: true },
      { model, param: 'fees', value: 123456, error: false },
      { model, param: 'isAnonymous', value: null, error: true },
      { model, param: 'isAnonymous', value: '', error: true },
      { model, param: 'isAnonymous', value: 'test', error: true },
      { model, param: 'isAnonymous', value: 123456, error: true },
      { model, param: 'isAnonymous', value: true, error: false },
      { model, param: 'isFeeCovered', value: null, error: false },
      { model, param: 'isFeeCovered', value: '', error: false },
      { model, param: 'isFeeCovered', value: 'test', error: true },
      { model, param: 'isFeeCovered', value: '123456', error: true },
      { model, param: 'isFeeCovered', value: 123456, error: true },
      { model, param: 'isFeeCovered', value: true, error: false },
      { model, param: 'isOfflineDonation', value: null, error: true },
      { model, param: 'isOfflineDonation', value: '', error: true },
      { model, param: 'isOfflineDonation', value: 'test', error: true },
      { model, param: 'isOfflineDonation', value: 123456, error: true },
      { model: () => TestHelper.generate.model('donation', { paymentTransactionId: 123 }), param: 'isOfflineDonation', value: false, error: false },
      { model, param: 'isOfflineDonation', value: true, error: false },
      { model, param: 'nonprofitId', value: null, error: true },
      { model, param: 'nonprofitId', value: '1234567890', error: true },
      { model, param: 'nonprofitId', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: true },
      { model: () => TestHelper.generate.model('donation', { isOfflineDonation: false }), param: 'paymentTransactionId', value: null, error: true },
      { model: () => TestHelper.generate.model('donation', { isOfflineDonation: false }), param: 'paymentTransactionId', value: '1234567890', error: true },
      { model: () => TestHelper.generate.model('donation', { isOfflineDonation: false }), param: 'paymentTransactionId', value: 123, error: false },
      { model, param: 'total', value: null, error: true },
      { model, param: 'total', value: '', error: true },
      { model, param: 'total', value: '123456', error: true },
      { model, param: 'total', value: 123456, error: false }
    ]
    TestHelper.validate(tests)
  })
})
