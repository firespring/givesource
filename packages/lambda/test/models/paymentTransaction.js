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
let PaymentTransaction

describe('PaymentTransaction', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({ Parameter: { Value: '' } })
    PaymentTransaction = (await loadModels()).PaymentTransaction
  })
  afterEach(function () {
    SecretsManager.prototype.getSecretValue.restore()
    Ssm.prototype.getParameter.restore()
  })

  describe('#construct()', function () {
    it('should be an instance of Model', function () {
      const model = new PaymentTransaction()
      assert.ok(model instanceof Model)
    })

    it('should be an instance of PaymentTransaction', function () {
      const model = new PaymentTransaction()
      assert.ok(model instanceof PaymentTransaction)
    })
  })

  describe('#populate()', function () {
    it('should only allow defined attributes', function () {
      const model = new PaymentTransaction({ test1: 123, test2: 'test', test3: true })
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
          const model = new PaymentTransaction({ createdAt: dateInput })

          model.timezone = timezone
          assert.equal(model.createdAt, expected)
        })
      })
    })

    it('does not error setting timezone without createdAt', function () {
      const model = new PaymentTransaction()
      model.timezone = 'America/Boise'
    })

    it('does not error setting null timezone without createdAt', function () {
      const model = new PaymentTransaction()
      model.timezone = null
    })
  })

  describe('#validate()', function () {
    const model = () => TestHelper.generate.model('paymentTransaction')
    const tests = [
      { model, param: 'billingZip', value: null, error: true },
      { model, param: 'billingZip', value: '', error: true },
      { model, param: 'billingZip', value: '123456', error: false },
      { model, param: 'billingZip', value: 123456, error: true },
      { model, param: 'creditCardExpirationMonth', value: null, error: true },
      { model, param: 'creditCardExpirationMonth', value: '', error: true },
      { model, param: 'creditCardExpirationMonth', value: '123456', error: true },
      { model, param: 'creditCardExpirationMonth', value: 123456, error: false },
      { model, param: 'creditCardExpirationYear', value: null, error: true },
      { model, param: 'creditCardExpirationYear', value: '', error: true },
      { model, param: 'creditCardExpirationYear', value: '123456', error: true },
      { model, param: 'creditCardExpirationYear', value: 123456, error: false },
      { model, param: 'creditCardLast4', value: null, error: true },
      { model, param: 'creditCardLast4', value: '', error: true },
      { model, param: 'creditCardLast4', value: '123456', error: false },
      { model, param: 'creditCardLast4', value: 123456, error: true },
      { model, param: 'creditCardName', value: null, error: true },
      { model, param: 'creditCardName', value: '', error: true },
      { model, param: 'creditCardName', value: 'test', error: false },
      { model, param: 'creditCardName', value: 123456, error: true },
      { model, param: 'creditCardType', value: null, error: true },
      { model, param: 'creditCardType', value: '', error: true },
      { model, param: 'creditCardType', value: '123456', error: false },
      { model, param: 'creditCardType', value: 123456, error: true },
      { model, param: 'isTestMode', value: null, error: true },
      { model, param: 'isTestMode', value: '', error: true },
      { model, param: 'isTestMode', value: 'test', error: true },
      { model, param: 'isTestMode', value: '123456', error: true },
      { model, param: 'isTestMode', value: 123456, error: true },
      { model, param: 'isTestMode', value: true, error: false },
      { model, param: 'transactionAmount', value: null, error: true },
      { model, param: 'transactionAmount', value: '', error: true },
      { model, param: 'transactionAmount', value: '123456', error: true },
      { model, param: 'transactionAmount', value: 123456, error: false },
      { model, param: 'transactionId', value: null, error: true },
      { model, param: 'transactionId', value: '', error: true },
      { model, param: 'transactionId', value: 'test', error: false },
      { model, param: 'transactionId', value: 123456, error: true },
      { model, param: 'transactionStatus', value: null, error: true },
      { model, param: 'transactionStatus', value: '', error: false },
      { model, param: 'transactionStatus', value: 'test', error: false },
      { model, param: 'transactionStatus', value: 123456, error: false }
    ]
    TestHelper.validate(tests)
  })
})
