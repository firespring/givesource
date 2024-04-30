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
const promiseMe = require('mocha-promise-me')
const sinon = require('sinon')
const GetPaymentTransactions = require('../../../src/api/getPaymentTransactions/index')
const PaymentTransactionsRepository = require('../../../src/repositories/paymentTransactions')
const TestHelper = require('../../helpers/test')

describe('GetPaymentTransactions', function () {
  it('should return a list of paymentTransactions', async function () {
    const models = await TestHelper.generate.modelCollection('paymentTransaction', 3)
    sinon.stub(PaymentTransactionsRepository.prototype, 'getAll').resolves(models)

    const result = await TestHelper.callApi(GetPaymentTransactions)
    assert(result === models)
    // //
    // return GetPaymentTransactions.handle({}, null, function (error, results) {
    //   assert(error === null)
    //   assert(results.length === 3)
    //   results.forEach(function (result, i) {
    //     assert(result.uuid === models[i].uuid)
    //   })
    // })
  })

  it('should return error on exception thrown', async function () {
    sinon.stub(PaymentTransactionsRepository.prototype, 'getAll').rejects('Error')
    return GetPaymentTransactions.handle({}, null, function (error, results) {
      assert(error instanceof Error)
    })
  })
})
