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

// const assert = require('assert')
// const promiseMe = require('mocha-promise-me')
// const sinon = require('sinon')
// const PatchPaymentTransaction = require('../../../src/api/patchPaymentTransaction/index')
// const PaymentTransactionsRepository = require('../../../src/repositories/paymentTransactions')
// const TestHelper = require('../../helpers/test')
//
// describe('PatchPaymentTransaction', function () {
//   // todo...
//   // it('should return an updated paymentTransaction', async function () {
//   //   const original = await TestHelper.generate.model('paymentTransaction')
//   //   const updated = await TestHelper.generate.model('paymentTransaction', { uuid: original.uuid })
//   //   sinon.stub(PaymentTransactionsRepository.prototype, 'get').resolves(original)
//   //   const upsertStub = sinon.stub(PaymentTransactionsRepository.prototype, 'save').resolves(updated)
//   //
//   //   const body = { someUpdatedParam: 'updated' }
//   //   const result = await TestHelper.callApi(PatchPaymentTransaction, {}, null, { body })
//   //   assert(result === updated)
//   //   assert(upsertStub.withArgs(original, body).callCount === 1)
//   // })
//   //
//   // it('should return error on exception thrown - get', async function () {
//   //   const original = await TestHelper.generate.model('paymentTransaction')
//   //   const params = {
//   //     params: {
//   //       paymentTransactionUuid: original.uuid
//   //     }
//   //   }
//   //   sinon.stub(PaymentTransactionsRepository.prototype, 'get').rejects(errorStub)
//   //   sinon.stub(PaymentTransactionsRepository.prototype, 'save').resolves(original)
//   //   return PatchPaymentTransaction.handle(params, null, function (error, result) {
//   //     assert(error instanceof Error)
//   //   })
//   // })
//   //
//   // it('should return error on exception thrown - save', async function () {
//   //   const original = await TestHelper.generate.model('paymentTransaction')
//   //   const params = {
//   //     params: {
//   //       paymentTransactionUuid: original.uuid
//   //     }
//   //   }
//   //   sinon.stub(PaymentTransactionsRepository.prototype, 'get').resolves(original)
//   //   sinon.stub(PaymentTransactionsRepository.prototype, 'save').rejects(errorStub)
//   //   return PatchPaymentTransaction.handle(params, null, function (error, result) {
//   //     assert(error instanceof Error)
//   //   })
//   // })
// })
