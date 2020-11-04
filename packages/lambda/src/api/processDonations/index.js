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

const _ = require('lodash');
const axios = require('axios');
const DonationHelper = require('./../../helpers/donation');
const DonationsRepository = require('./../../repositories/donations');
const DonorsRepository = require('./../../repositories/donors');
const HttpException = require('./../../exceptions/http');
const Lambda = require('./../../aws/lambda');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const Request = require('./../../aws/request');
const SettingHelper = require('./../../helpers/setting');
const SettingsRepository = require('./../../repositories/settings');
const SSM = require('./../../aws/ssm');

export function handle(event, context, callback) {
	const donationsRepository = new DonationsRepository();
	const donorsRepository = new DonorsRepository();
	const lambda = new Lambda();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();
	const settingsRepository = new SettingsRepository();
	const ssm = new SSM();
	const request = new Request(event, context).parameters(['donor', 'donations', 'payment']);

	let apiKey = null;
	let donations = [];
	let savedDonations = [];
	let donor = null;
	let fees = 0;
	let nonprofitIds = [];
	let paymentTransaction = null;
	let subtotal = 0;
	let total = 0;
	let settings = {
		'EVENT_TIMEZONE': null,
	};

	settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE] = null;
	settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE] = null;
	settings[SettingHelper.SETTING_EVENT_TITLE] = '';

	const payment = request.get('payment', {});
	request.validate().then(() => {
		return DonationHelper.validatePaymentSpringPayment(payment);
	}).then(() => {
		return settingsRepository.batchGet(Object.keys(settings));
	}).then((response) => {
		response.forEach((setting) => {
			settings[setting.key] = setting.value;
		});
		let key = '/' + process.env.AWS_STACK_NAME + '/settings/secure/';
		key += payment.is_test_mode ? 'payment-spring-test-api-key' : 'payment-spring-api-key';
		return ssm.getParameter(process.env.AWS_REGION, key, true);
	}).then((response) => {
		if (response && response.Parameter) {
			apiKey = response.Parameter.Value;
		} else {
			return Promise.reject(new HttpException('invalid payment gateway settings'));
		}

		let promise = Promise.resolve();
		request.get('donations', []).forEach((donation) => {
			let transactionFlatFee = settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE];
			transactionFlatFee = transactionFlatFee ? parseInt(transactionFlatFee) : 0;

			let transactionPercentFee = settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE];
			transactionPercentFee = transactionPercentFee ? parseFloat(transactionPercentFee) : 0;

			donation.fees = DonationHelper.calculateFees(donation.isOfflineDonation, donation.isFeeCovered, donation.subtotal, transactionFlatFee, transactionPercentFee);
			donation.amountForNonprofit = donation.total - donation.fees;
			promise = promise.then(function () {
				return donationsRepository.populate(donation);
			}).then(function (model) {
				if (model.nonprofitId && !nonprofitIds.indexOf(model.nonprofitId) > -1) {
					nonprofitIds.push(model.nonprofitId);
				}
				if (model.subtotal) {
					subtotal += model.subtotal;
				}
				if (model.isFeeCovered && model.fees) {
					fees += model.fees;
				}

				donations.push(model);
			});
		});

		return promise;
	}).then(() => {
		total = subtotal + fees;
	}).then(() => {
		const data = request.get('donor', {});
		if (data.hasOwnProperty('email')) {
			return donorsRepository.queryEmail(data.email).then(function (popDonor) {
				if (!popDonor) {
					return donorsRepository.populate(data);
				}
				return popDonor;
			});
		}
		return donorsRepository.populate(data);
	}).then((popDonor) => {
		donor = popDonor;
		return axios({
			method: 'post',
			url: 'https://api.paymentspring.com/api/v1/charge',
			data: {
				token: payment.id,
				amount: total,
				send_receipt: false,
				description: settings[SettingHelper.SETTING_EVENT_TITLE]
			},
			auth: {
				username: apiKey,
				password: ''
			}
		}).catch(err => {
			if (err.response && err.response.data) {
				console.log('Error: %j', err.response.data);

				if (err.response.data.errors && err.response.data.errors[0]) {
					return Promise.reject(new Error('There was an error processing your payment: ' + err.response.data.errors[0].message
						+ '. Please double check your credit card information, or call the number on the back of your credit card.'));
				}
			}

			return Promise.reject(new Error('There was an error processing your payment. Please double check your credit card information.'));
		});
	}).then((response) => {
		return paymentTransactionsRepository.populate({
			billingZip: response.data.zip,
			creditCardExpirationMonth: parseInt(response.data.card_exp_month),
			creditCardExpirationYear: parseInt(response.data.card_exp_year),
			creditCardLast4: response.data.card_number.replace(/\*/g, ''),
			creditCardName: response.data.card_owner_name,
			creditCardType: response.data.card_type,
			isTestMode: payment.is_test_mode,
			transactionAmount: response.data.amount_settled,
			transactionId: response.data.id,
			transactionStatus: response.data.status
		});
	}).then((popPT) => {
		paymentTransaction = popPT;
		// return !payment.is_test_mode ? paymentTransactionsRepository.upsert(paymentTransaction, {}) : Promise.resolve(paymentTransaction);
		return paymentTransactionsRepository.upsert(paymentTransaction, {});
	}).then((response) => {
		paymentTransaction = response;
		paymentTransaction.timezone = settings.EVENT_TIMEZONE;
		donations.forEach((donation) => {
			donation.paymentTransactionId = response.id;
			donation.paymentTransactionAmount = response.transactionAmount;
			donation.paymentTransactionIsTestMode = response.isTestMode;
			donation.paymentTransactionStatus = response.transactionStatus;
		});
	}).then(function () {
		// return !payment.is_test_mode ? donorsRepository.upsert(donor, {}) : Promise.resolve(donor);
		return donorsRepository.upsert(donor, {});
	}).then(function (savedDonor) {
		donor = savedDonor;
		let promise = Promise.resolve();
		donations.forEach(function (donation) {
			promise = promise.then(function () {
				return donationsRepository.upsert(donation, {donorId: donor.id});
			}).then(function (donation) {
				return donationsRepository.get(donation.id);
			}).then(function (donation) {
				savedDonations.push(donation);
			});
		});
		donations = savedDonations;
		return promise;
	}).then(() => {
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
	}).then(() => {
		const body = {
			donations: donations.map((donation) => {
				donation.timezone = settings.EVENT_TIMEZONE;
				donation.total = donation.formattedAmount;
				return donation;
			}),
			donor: donor,
			paymentTransaction: paymentTransaction,
		};
		// there was a mutate function looking like to fix the timezones
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationsReceiptEmail', {body: body});
	}).then(() => {
		const body = {
			donations: donations.map((donation) => {
				donation.timezone = settings.EVENT_TIMEZONE;
				return donation;
			})

		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationNotificationEmail', {body: body});
		callback();
	}).catch((err) => {
		if (err.response) {
			console.log('Error: %j', err.response.data);
		}
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
}
