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
const Donation = require('./../../models/donation');
const DonationsRepository = require('./../../repositories/donations');
const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const FilesRepository = require('./../../repositories/files');
const HttpException = require('./../../exceptions/http');
const PaymentTransaction = require('./../../models/paymentTransaction');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const QueryBuilder = require('./../../aws/queryBuilder');
const RenderHelper = require('./../../helpers/render');
const Request = require('./../../aws/request');
const SettingsRepostiory = require('./../../repositories/settings');

exports.handle = (event, context, callback) => {
	const donationsRepository = new DonationsRepository();
	const donorsRepository = new DonorsRepository();
	const filesRepository = new FilesRepository();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();
	const request = new Request(event, context);
	const settingsRepository = new SettingsRepostiory();

	let donor = request.get('donor', null);
	let donations = request.get('donations', []);
	let paymentTransaction = request.get('paymentTransaction', null);
	let transactions = [];

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
	request.validate().then(() => {
		return settingsRepository.batchGet(Object.keys(settings));
	}).then(response => {
		response.forEach(setting => {
			settings[setting.key] = setting.value;
		});

		if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
			return filesRepository.get(settings.EVENT_LOGO);
		} else {
			return Promise.resolve(null);
		}
	}).then(response => {
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
	}).then(response => {
		if (response) {
			donor = response.mutate(null, {timezone: settings.EVENT_TIMEZONE});
		}

		if (donor && donations.length === 0) {
			const builder = new QueryBuilder('query');
			builder.limit(1000).index('donorUuidCreatedOnIndex').condition('donorUuid', '=', donor.uuid).condition('createdOn', '>', 0).scanIndexForward(false);
			return donationsRepository.batchQuery(builder);
		}
		return Promise.resolve({});
	}).then(response => {
		if (response.hasOwnProperty('Items')) {
			donations = response.Items.map(donation => {
				const model = new Donation(donation);
				const data = model.mutate(null, {timezone: settings.EVENT_TIMEZONE});
				data.isFeeCovered = (data.isFeeCovered === 'Yes' || data.isFeeCovered === true);
				data.isOfflineDonation = (data.isOfflineDonation === 'Yes' || data.isOfflineDonation === true);
				return data;
			});
		}

		let promise = Promise.resolve();
		if (paymentTransaction && donations.length) {
			donations = donations.map(donation => {
				const data = (donation instanceof Donation) ? donation.mutate(null, {timezone: settings.EVENT_TIMEZONE}) : donation;
				data.isFeeCovered = (data.isFeeCovered === 'Yes' || data.isFeeCovered === true);
				data.isOfflineDonation = (data.isOfflineDonation === 'Yes' || data.isOfflineDonation === true);
				return data;
			});

			const transaction = (paymentTransaction instanceof PaymentTransaction) ? paymentTransaction.mutate(null, {timezone: settings.EVENT_TIMEZONE}) : paymentTransaction;
			transaction.donations = donations;
			transaction.isAnonymous = transaction.donations.length ? transaction.donations[0].isAnonymous : false;
			transaction.isFeeCovered = transaction.donations.length ? transaction.donations[0].isFeeCovered : false;
			transactions.push(transaction);
		} else {
			const paymentTransactionUuids = donations.map((donation) => {
				return donation.paymentTransactionUuid || null;
			}).filter((uuid, index, uuids) => {
				return uuid !== null && index === uuids.indexOf(uuid);
			});

			paymentTransactionUuids.forEach(uuid => {
				promise = promise.then(() => {
					return paymentTransactionsRepository.get(uuid);
				}).then(paymentTransaction => {
					const transaction = paymentTransaction.mutate(null, {timezone: settings.EVENT_TIMEZONE});
					transaction.donations = _.filter(donations, {paymentTransactionUuid: uuid});
					transaction.isAnonymous = transaction.donations.length ? transaction.donations[0].isAnonymous : false;
					transaction.isFeeCovered = transaction.donations.length ? transaction.donations[0].isFeeCovered : false;
					transactions.push(transaction);
				}).catch(() => {
					// Ignore missing transactions (no transactions are created in test mode)
				});
			});
		}

		return promise.then(() => {
			if (!transactions.length && donations.length) {
				donations.forEach((donation) => {
					const transaction = new PaymentTransaction();
					transaction.donations = [donation];
					transaction.isAnonymous = donation.isAnonymous;
					transaction.isFeeCovered = donation.isFeeCovered;
					transactions.push(transaction);
				});
			}

			if (!transactions.length) {
				return Promise.reject(new Error('No donations were found'));
			}
		});
	}).then(() => {
		return RenderHelper.renderTemplate('emails.donation-receipt', {
			donor: donor,
			settings: settings,
			transactions: transactions
		});
	}).then(response => {
		callback(null, {
			html: response
		});
	}).catch(err => {
		console.log('Error: %j', err);
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};