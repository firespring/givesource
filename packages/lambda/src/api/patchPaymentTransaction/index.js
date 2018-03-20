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

const HttpException = require('./../../exceptions/http');
const PaymentTransaction = require('./../../models/paymentTransaction');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new PaymentTransactionsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let paymentTransaction = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('payment_transaction_uuid'));
	}).then(function (result) {
		paymentTransaction = new PaymentTransaction(result);
		paymentTransaction.populate(request._body);
		return paymentTransaction.validate();
	}).then(function () {
		return repository.save(paymentTransaction);
	}).then(function (model) {
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};