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
const Donation = require('./../../models/donation');
const DonationHelper = require('./../../helpers/donation');
const DonationsRepository = require('./../../repositories/donations');
const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const HttpException = require('./../../exceptions/http');
const Lambda = require('./../../aws/lambda');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const PaymentTransaction = require('./../../models/paymentTransaction');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const Request = require('./../../aws/request');
const SettingHelper = require('./../../helpers/setting');
const SettingsRepository = require('./../../repositories/settings');
const SSM = require('./../../aws/ssm');

export function handle(event, context, callback) {
	const donationsRepository = new DonationsRepository();
	const donorsRepository = new DonorsRepository();
	const lambda = new Lambda();
	const nonprofitsRepository = new NonprofitsRepository();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();
	const settingsRepository = new SettingsRepository();
	const ssm = new SSM();
	const request = new Request(event, context).parameters(['donor', 'donations', 'payment']);

	let apiKey = null;
	let donations = [];
	let donor = null;
	let fees = 0;
	let nonprofits = [];
	let nonprofitUuids = [];
	let paymentTransaction = null;
	let subtotal = 0;
	let total = 0;
	let topDonation = 0;
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
			const model = new Donation(donation);
			if (model.nonprofitUuid && !nonprofitUuids.indexOf(model.nonprofitUuid) > -1) {
				nonprofitUuids.push(model.nonprofitUuid);
			}
			if (model.subtotal) {
				subtotal += model.subtotal;
			}
			if (model.isFeeCovered && model.fees) {
				fees += model.fees;
			}
			donations.push(model);
			promise = promise.then(() => {
				return model.validate([
					'fees',
					'isAnonymous',
					'isFeeCovered',
					'isOfflineDonation',
					'nonprofitUuid',
					'subtotal',
					'total',
					'note'
				]);
			});
		});
		return promise;
	}).then(() => {
		total = subtotal + fees;

		let promise = Promise.resolve();
		nonprofitUuids.forEach((nonprofitUuid) => {
			promise = promise.then(() => {
				return nonprofitsRepository.get(nonprofitUuid).then((response) => {
					nonprofits.push(response);
				});
			});
		});
		return promise;
	}).then(() => {
		const data = request.get('donor', {});
		if (data.hasOwnProperty('email')) {
			return donorsRepository.queryEmail(data.email);
		}
		return Promise.resolve(new Donor());
	}).then((response) => {
		if (response) {
			donor = response;
			return Promise.resolve();
		} else {
			donor = new Donor();
			if (!payment.is_test_mode) {
				const body = {
					amount: 1,
					key: 'DONORS_COUNT'
				};
				lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricAddAmount', {body: body});
			}
		}
	}).then(() => {
		donor.populate(request.get('donor', {}));
		return donor.validate();
	}).then(() => {
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
		});
	}).then((response) => {
		paymentTransaction = new PaymentTransaction({
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
		return paymentTransaction.validate();
	}).then(() => {
		return !payment.is_test_mode ? paymentTransactionsRepository.save(paymentTransaction) : Promise.resolve(paymentTransaction);
	}).then((response) => {
		donations.forEach((donation) => {
			donation.paymentTransactionUuid = response.uuid;
			donation.creditCardName = response.creditCardName;
			donation.creditCardType = response.creditCardType;
			donation.creditCardLast4 = response.creditCardLast4;
			donation.creditCardExpirationMonth = response.creditCardExpirationMonth;
			donation.creditCardExpirationYear = response.creditCardExpirationYear;
			donation.creditCardZip = response.billingZip;
			donation.paymentTransactionId = response.transactionId;
			donation.paymentTransactionAmount = response.transactionAmountInCents;
			donation.paymentTransactionIsTestMode = response.isTestMode;
			donation.paymentTransactionStatus = response.transactionStatus;
		});
		return !payment.is_test_mode ? donorsRepository.save(donor) : Promise.resolve(donor);
	}).then((response) => {
		donations.forEach((donation) => {
			donation.donorUuid = response.uuid;
			if (!donation.isAnonymous) {
				donation.donorFirstName = response.firstName;
				donation.donorLastName = response.lastName;
				donation.donorEmail = response.email;
				donation.donorPhone = response.phone;
				donation.donorAddress1 = response.address1;
				donation.donorAddress2 = response.address2;
				donation.donorCity = response.city;
				donation.donorState = response.state;
				donation.donorZip = response.zip;
			}
		});
		nonprofits.forEach((nonprofit) => {
			_.filter(donations, {nonprofitUuid: nonprofit.uuid}).forEach((donation) => {
				donation.nonprofitLegalName = nonprofit.legalName;
				donation.nonprofitAddress1 = nonprofit.address1;
				donation.nonprofitAddress2 = nonprofit.address2;
				donation.nonprofitAddress3 = nonprofit.address3;
				donation.nonprofitCity = nonprofit.city;
				donation.nonprofitState = nonprofit.state;
				donation.nonprofitZip = nonprofit.zip;

				nonprofit.donationsCount = nonprofit.donationsCount + 1;
				nonprofit.donationsFees = nonprofit.donationsFees + donation.fees;
				nonprofit.donationsFeesCovered = donation.isFeeCovered ? nonprofit.donationsFeesCovered + donation.fees : nonprofit.donationsFeesCovered;
				nonprofit.donationsSubtotal = nonprofit.donationsSubtotal + donation.subtotal;
				nonprofit.donationsTotal = nonprofit.donationsTotal + donation.total;
				topDonation = donation.subtotal > topDonation ? donation.subtotal : topDonation;
			});
		});
		return donationsRepository.batchUpdate(donations);
	}).then(() => {
		return !payment.is_test_mode ? nonprofitsRepository.batchUpdate(nonprofits) : Promise.resolve();
	}).then(() => {
		if (!payment.is_test_mode) {
			const body = {
				amount: donations.length,
				key: 'DONATIONS_COUNT'
			};
			lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricAddAmount', {body: body});
		}
	}).then(() => {
		if (!payment.is_test_mode) {
			const body = {
				amount: subtotal,
				key: 'DONATIONS_TOTAL'
			};
			lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricAddAmount', {body: body});
		}
	}).then(() => {
		if (!payment.is_test_mode) {
			const body = {
				amount: topDonation,
				key: 'TOP_DONATION'
			};
			lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricMaxAmount', {body: body});
		}
	}).then(() => {
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
	}).then(() => {
		const body = {
			donations: donations.map((donation) => {
				return donation.mutate(null, {timezone: settings.EVENT_TIMEZONE});
			}),
			donor: donor.mutate(null, {timezone: settings.EVENT_TIMEZONE}),
			paymentTransaction: paymentTransaction.mutate(null, {timezone: settings.EVENT_TIMEZONE})
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationsReceiptEmail', {body: body});
	}).then(() => {
		const body = {
			donations: donations.map((donation) => {
				return donation.all();
			})
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationNotificationEmail', {body: body});
		callback();
	}).catch((err) => {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});

};