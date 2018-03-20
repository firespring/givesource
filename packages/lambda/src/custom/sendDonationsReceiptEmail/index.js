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

const _ = require('lodash');
const Donation = require('./../../models/donation');
const DonationsRepository = require('./../../repositories/donations');
const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const EmailHelper = require('./../../helpers/email');
const FilesRepository = require('./../../repositories/files');
const HttpException = require('./../../exceptions/http');
const PaymentTransaction = require('./../../models/paymentTransaction');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const QueryBuilder = require('./../../aws/queryBuilder');
const RenderHelper = require('./../../helpers/render');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const SettingsRepostiory = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const donationsRepository = new DonationsRepository();
	const donorsRepository = new DonorsRepository();
	const filesRepository = new FilesRepository();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();
	const request = new Request(event, context);
	const ses = new SES();
	const settingsRepository = new SettingsRepostiory();

	let donor = request.get('donor', null);
	let donations = request.get('donations', []);
	let paymentTransaction = request.get('paymentTransaction', null);
	let transactions = [];

	let html = '';
	let settings = {
		CONTACT_PHONE: null,
		EMAILS_DONATION_RECEIPT_AFTER_LIST: null,
		EMAILS_DONATION_RECEIPT_BEFORE_LIST: null,
		EVENT_URL: null,
		EVENT_TIMEZONE: null,
		EVENT_TITLE: null,
		EVENT_LOGO: null,
		PAGE_TERMS_ENABLED: null,
		UPLOADS_CLOUD_FRONT_URL: null,
	};
	request.validate().then(function () {
		return settingsRepository.batchGet(Object.keys(settings));
	}).then(function (response) {
		response.forEach(function (setting) {
			settings[setting.key] = setting.value;
		});

		if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
			return filesRepository.get(settings.EVENT_LOGO);
		} else {
			return Promise.resolve(null);
		}
	}).then(function () {
		if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
			return filesRepository.get(settings.EVENT_LOGO);
		} else {
			return Promise.resolve(null);
		}
	}).then(function (response) {
		if (response) {
			settings.EVENT_LOGO = settings.UPLOADS_CLOUD_FRONT_URL + '/' + response.path;
		}

		if (donor) {
			donor = (donor instanceof Donor) ? donor.mutate(null, {timezone: settings.EVENT_TIMEZONE}) : donor;
			return Promise.resolve();
		} else if (request.get('email', false)) {
			return donorsRepository.queryEmail(request.get('email'));
		} else {
			return Promise.reject(new Error('donor or email address missing'));
		}
	}).then(function (response) {
		if (response) {
			donor = response.mutate(null, {timezone: settings.EVENT_TIMEZONE});
		}
		if (donor && donations.length === 0) {
			const builder = new QueryBuilder('query');
			builder.limit(100).index('donorUuidCreatedOnIndex').condition('donorUuid', '=', donor.uuid).condition('createdOn', '>', 0).scanIndexForward(false);
			return donationsRepository.batchQuery(builder);
		}
		return Promise.resolve({});
	}).then(function (response) {
		if (response.hasOwnProperty('Items')) {
			donations = response.Items.map(function (donation) {
				const model = new Donation(donation);
				return model.mutate(null, {timezone: settings.EVENT_TIMEZONE});
			});
		}

		let promise = Promise.resolve();
		if (paymentTransaction && donations.length) {
			donations = donations.map(function (donation) {
				return (donation instanceof Donation) ? donation.mutate(null, {timezone: settings.EVENT_TIMEZONE}) : donation;
			});

			const transaction = (paymentTransaction instanceof PaymentTransaction) ? paymentTransaction.mutate(null, {timezone: settings.EVENT_TIMEZONE}) : paymentTransaction;
			transaction.donations = donations;
			transaction.isAnonymous = transaction.donations.length ? transaction.donations[0].isAnonymous : false;
			transaction.isFeeCovered = transaction.donations.length ? transaction.donations[0].isFeeCovered : false;
			transactions.push(transaction);
		} else {
			const paymentTransactionUuids = donations.map(function (donation) {
				return donation.paymentTransactionUuid || null;
			}).filter(function (uuid, index, uuids) {
				return uuid !== null && index === uuids.indexOf(uuid);
			});

			paymentTransactionUuids.forEach(function (uuid) {
				promise = promise.then(function () {
					return paymentTransactionsRepository.get(uuid);
				}).then(function (paymentTransaction) {
					const transaction = paymentTransaction.mutate(null, {timezone: settings.EVENT_TIMEZONE});
					transaction.donations = _.filter(donations, {paymentTransactionUuid: uuid});
					transaction.isAnonymous = transaction.donations.length ? transaction.donations[0].isAnonymous : false;
					transaction.isFeeCovered = transaction.donations.length ? transaction.donations[0].isFeeCovered : false;
					transactions.push(transaction);
				});
			});
		}

		return promise;
	}).then(function () {
		return RenderHelper.renderTemplate('emails.donation-receipt', {
			donor: donor,
			settings: settings,
			transactions: transactions
		});
	}).then(function (response) {
		if (response) {
			html = response;
			return EmailHelper.getContactEmailAddresses();
		} else {
			return Promise.reject(new Error('unable to generate receipt email'));
		}
	}).then(function (response) {
		if (response.from.email && response.from.verified) {
			const toAddresses = [donor.email];
			const subject = settings.EVENT_TITLE ? 'Tax receipt: Thank you for participating in ' + settings.EVENT_TITLE : 'Tax receipt: Thank you for giving';
			return ses.sendEmail(subject, html, null, response.from.email, toAddresses);
		} else {
			return Promise.reject(new Error('from contact email address missing or not verified'));
		}
	}).then(function () {
		callback();
	}).catch(function (err) {
		console.log('Error: %j', err);
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};