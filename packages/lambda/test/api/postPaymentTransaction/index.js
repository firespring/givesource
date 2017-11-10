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
const HttpException = require('./../../../src/exceptions/http');
const PostPaymentTransaction = require('../../../src/api/postPaymentTransaction/index');
const PaymentTransactionsRepository = require('../../../src/repositories/paymentTransactions');
const sinon = require('sinon');
const TestHelper = require('../../helpers/test');

describe('PostPaymentTransaction', function () {

	afterEach(function () {
		PaymentTransactionsRepository.prototype.save.restore();
	});

	it('should return a paymentTransaction', function () {
		const model = TestHelper.generate.model('paymentTransaction');
		sinon.stub(PaymentTransactionsRepository.prototype, 'save').resolves(model);
		const params = {
			body: model.except(['uuid', 'createdOn'])
		};
		return PostPaymentTransaction.handle(params, null, function (error, result) {
			assert(error === null);
			TestHelper.assertModelEquals(result, model, ['uuid', 'createdOn']);
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(PaymentTransactionsRepository.prototype, 'save').rejects('Error');
		return PostPaymentTransaction.handle({}, null, function (error) {
			assert(error instanceof HttpException);
		});
	});

});