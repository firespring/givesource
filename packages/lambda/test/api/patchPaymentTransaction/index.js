/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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