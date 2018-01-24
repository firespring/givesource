/*
 * Copyright (C) 2018  Firespring
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

const _ = require('lodash');
const DonationsRepository = require('./../../repositories/donations');
const DonorsRepository = require('./../../repositories/donors');
const Lambda = require('./../../aws/lambda');
const HttpException = require('./../../exceptions/http');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const QueryBuilder = require('./../../aws/queryBuilder');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');

exports.handle = function (event, context, callback) {
	const donationsRepository = new DonationsRepository();
	const donorsRepository = new DonorsRepository();
	const lambda = new Lambda();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();
	const request = new Request(event, context).parameters(['email']);
	const ses = new SES();

	let donor = null;
	let donations = [];
	let paymentTransactions = {};

	request.validate().then(function () {
		return donorsRepository.queryEmail(request.get('email'));
	}).then(function (response) {
		if (response) {
			donor = response;
			const builder = new QueryBuilder('query');
			builder.limit(100).index('donorUuidCreatedOnIndex').condition('donorUuid', '=', donor.uuid).condition('createdOn', '>', 0).scanIndexForward(false);
			return donationsRepository.batchQuery(builder);
		} else {
			return Promise.resolve({});
		}
	}).then(function (response) {
		if (response.hasOwnProperty('Items')) {
			donations = response.Items;
		}

		const paymentTransactionUuids = donations.map(function (donation) {
			return donation.paymentTransactionUuid || null;
		}).filter(function (uuid, index, uuids) {
			return uuid !== null && index === uuids.indexOf(uuid);
		});

		let promise = Promise.resolve();
		paymentTransactionUuids.forEach(function (uuid) {
			promise = promise.then(function () {
				return paymentTransactionsRepository.get(uuid);
			}).then(function (paymentTransaction) {
				paymentTransactions[uuid] = paymentTransaction;
				paymentTransactions[uuid].donations = _.filter(donations, {paymentTransactionUuid: uuid});
			});
		});
		return promise;
	}).then(function () {
		const body = {
			template: 'emails.donation-receipt',
			data: paymentTransactions,
		};
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-RenderTemplate', {body: body});
	}).then(function (response) {
		console.log(response);
		// TODO: Send an email to the donor
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};