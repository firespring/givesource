/*
 * Copyright 2018 Firespring, Inc.
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

const assert = require('assert');
const sinon = require('sinon');
const PatchPaymentTransaction = require('../../../src/api/patchPaymentTransaction/index');
const PaymentTransactionsRepository = require('../../../src/repositories/paymentTransactions');
const TestHelper = require('../../helpers/test');

describe('PatchPaymentTransaction', function () {

	afterEach(function () {
		PaymentTransactionsRepository.prototype.get.restore();
		PaymentTransactionsRepository.prototype.save.restore();
	});

	it('should return an updated paymentTransaction', function () {
		const original = TestHelper.generate.model('paymentTransaction');
		const updated = TestHelper.generate.model('paymentTransaction', {uuid: original.uuid});
		sinon.stub(PaymentTransactionsRepository.prototype, 'get').resolves(original);
		sinon.stub(PaymentTransactionsRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except('uuid'),
			params: {
				paymentTransactionUuid: original.uuid
			}
		};
		return PatchPaymentTransaction.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const original = TestHelper.generate.model('paymentTransaction');
		const params = {
			params: {
				paymentTransactionUuid: original.uuid
			}
		};
		sinon.stub(PaymentTransactionsRepository.prototype, 'get').rejects('Error');
		sinon.stub(PaymentTransactionsRepository.prototype, 'save').resolves(original);
		return PatchPaymentTransaction.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const original = TestHelper.generate.model('paymentTransaction');
		const params = {
			params: {
				paymentTransactionUuid: original.uuid
			}
		};
		sinon.stub(PaymentTransactionsRepository.prototype, 'get').resolves(original);
		sinon.stub(PaymentTransactionsRepository.prototype, 'save').rejects('Error');
		return PatchPaymentTransaction.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});