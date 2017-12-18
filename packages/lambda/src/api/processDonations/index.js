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

const _ = require('lodash');
const axios = require('axios');
const Donation = require('./../../models/donation');
const DonationsRepository = require('./../../repositories/donations');
const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const HttpException = require('./../../exceptions/http');
const MetricsHelper = require('./../../helpers/metrics');
const MissingRequiredParameter = require('./../../exceptions/missingRequiredParameter');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const PaymentTransaction = require('./../../models/paymentTransaction');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const Request = require('./../../aws/request');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const donationsRepository = new DonationsRepository();
	const donorsRepository = new DonorsRepository();
	const nonprofitsRepository = new NonprofitsRepository();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();
	const settingsRepository = new SettingsRepository();
	const request = new Request(event, context).parameters(['donor', 'donations', 'payment']);

	let donations = [];
	let donor = null;
	let nonprofits = [];
	let nonprofitUuids = [];
	let paymentTransaction = null;
	let apiKey = null;
	let subtotal = 0;
	let total = 0;
	let topDonation = 0;
	request.validate().then(function () {
		const paymentFields = [
			'card_exp_month',
			'card_exp_year',
			'card_owner_name',
			'card_type',
			'class',
			'id',
			'is_test_mode',
			'last_4',
			'token_type'
		];

		const payment = request.get('payment', {});
		paymentFields.forEach(function (param) {
			if (!payment.hasOwnProperty(param)) {
				return Promise.reject(new MissingRequiredParameter('Missing required parameter: payment.' + param));
			}
		});

		const key = payment.is_test_mode ? 'PAYMENT_SPRING_TEST_API_KEY' : 'PAYMENT_SPRING_API_KEY';
		return settingsRepository.get(key);
	}).then(function (response) {
		apiKey = response.value;

		let promise = Promise.resolve();
		request.get('donations', []).forEach(function (donation) {
			const model = new Donation(donation);
			if (model.nonprofitUuid && !nonprofitUuids.indexOf(model.nonprofitUuid) > -1) {
				nonprofitUuids.push(model.nonprofitUuid);
			}
			if (model.total) {
				total += model.total;
			}
			if (model.subtotal) {
				subtotal += model.subtotal;
			}
			donations.push(model);
			promise = promise.then(function () {
				return model.validate([
					'fees',
					'isAnonymous',
					'isFeeCovered',
					'isOfflineDonation',
					'nonprofitUuid',
					'subtotal',
					'total'
				]);
			});
		});
		return promise;
	}).then(function () {
		let promise = Promise.resolve();
		nonprofitUuids.forEach(function (nonprofitUuid) {
			promise = promise.then(function () {
				return nonprofitsRepository.get(nonprofitUuid).then(function (response) {
					nonprofits.push(response);
				});
			});
		});
		return promise;
	}).then(function () {
		const data = request.get('donor', {});
		if (data.hasOwnProperty('email')) {
			return donorsRepository.queryEmail(data.email);
		}
		return Promise.resolve(new Donor());
	}).then(function (response) {
		if (response) {
			donor = response;
			return Promise.resolve();
		} else {
			donor = new Donor();
			return MetricsHelper.addAmountToMetric('DONORS_COUNT', 1);
		}
	}).then(function () {
		donor.populate(request.get('donor', {}));
		return donor.validate();
	}).then(function () {
		return axios({
			method: 'post',
			url: 'https://api.paymentspring.com/api/v1/charge',
			data: {
				token: request.get('payment').id,
				amount: total,
				send_receipt: false,
			},
			auth: {
				username: apiKey,
				password: ''
			}
		});
	}).then(function (response) {
		paymentTransaction = new PaymentTransaction({
			billingZip: response.data.zip,
			creditCardExpirationMonth: parseInt(response.data.card_exp_month),
			creditCardExpirationYear: parseInt(response.data.card_exp_year),
			creditCardLast4: response.data.card_number.replace('*', ''),
			creditCardName: response.data.card_owner_name,
			creditCardType: response.data.card_type,
			isTestMode: request.get('payment').is_test_mode,
			transactionAmountInCents: response.data.amount_settled,
			transactionId: response.data.id,
			transactionStatus: response.data.status
		});
		return paymentTransaction.validate();
	}).then(function () {
		return paymentTransactionsRepository.save(paymentTransaction);
	}).then(function () {
		return donorsRepository.save(donor);
	}).then(function () {
		donations.forEach(function (donation) {
			donation.paymentTransactionUuid = paymentTransaction.uuid;
			donation.donorUuid = donor.uuid;
		});
		return donationsRepository.batchUpdate(donations);
	}).then(function () {
		nonprofits.forEach(function (nonprofit) {
			_.filter(donations, {nonprofitUuid: nonprofit.uuid}).forEach(function (donation) {
				nonprofit.donationsCount = nonprofit.donationsCount + 1;
				nonprofit.donationsFees = nonprofit.donationsFees + donation.fees;
				nonprofit.donationsFeesCovered = donation.isFeeCovered ? nonprofit.donationsFeesCovered + donation.fees : nonprofit.donationsFeesCovered;
				nonprofit.donationsSubtotal = nonprofit.donationsSubtotal + donation.subtotal;
				nonprofit.donationsTotal = nonprofit.donationsTotal + donation.total;
				topDonation = donation.subtotal > topDonation ? donation.subtotal : topDonation;
			});
		});
		return nonprofitsRepository.batchUpdate(nonprofits);
	}).then(function () {
		return MetricsHelper.addAmountToMetric('DONATIONS_COUNT', donations.length);
	}).then(function () {
		return MetricsHelper.addAmountToMetric('DONATIONS_TOTAL', subtotal);
	}).then(function () {
		return MetricsHelper.maxMetricAmount('TOP_DONATION', topDonation);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};