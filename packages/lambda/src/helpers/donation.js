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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../../.env`});

const MissingRequiredParameter = require('./../exceptions/missingRequiredParameter');
const SettingsRepository = require('./../repositories/settings');
const SettingHelper = require('./setting');

exports.TYPE_BULK = 'BULK';
exports.TYPE_SINGLE = 'SINGLE';

/**
 * Get fields for Report
 *
 * @type {[]}
 */
exports.reportFields = [
	{
		label: 'ID',
		value: 'uuid'
	},
	{
		label: 'Date',
		value: 'createdOn',
	},
	{
		label: 'Nonprofit',
		value: 'nonprofitLegalName',
	},
	{
		label: 'Is Offline',
		value: 'isOfflineDonation',
	},
	{
		label: 'Donations Count',
		value: 'count',
	},
	{
		label: 'Donor First Name',
		value: 'donorFirstName',
	},
	{
		label: 'Donor Last Name',
		value: 'donorLastName',
	},
	{
		label: 'Donor Address 1',
		value: 'donorAddress1',
	},
	{
		label: 'Donor Address 2',
		value: 'donorAddress2',
	},
	{
		label: 'Donor City',
		value: 'donorCity',
	},
	{
		label: 'Donor State',
		value: 'donorState',
	},
	{
		label: 'Donor Zip',
		value: 'donorZip',
	},
	{
		label: 'Donor Email',
		value: 'donorEmail',
	},
	{
		label: 'Donor Phone Number',
		value: 'donorPhone',
	},
	{
		label: 'Donation Amount',
		value: 'subtotal',
	},
	{
		label: 'Is Fee Covered',
		value: 'isFeeCovered',
	},
	{
		label: 'Donation Fee',
		value: 'fees',
	},
	{
		label: 'Subtotal Charged to Card',
		value: 'subtotalChargedToCard',
	},
	{
		label: 'Amount for Nonprofit',
		value: 'amountForNonprofit',
	},
	{
		label: 'Message',
		value: 'note'
	}
];

/**
 * Calculate donation fees
 *
 * @param {Boolean} isOfflineDonation
 * @param {Boolean} isFeeCovered
 * @param {number} amount
 * @param {number} transactionFlatFee
 * @param {number} transactionPercentFee
 * @return {number}
 */
exports.calculateFees = function (isOfflineDonation, isFeeCovered, amount, transactionFlatFee, transactionPercentFee) {
	if (!isOfflineDonation && isFeeCovered) {
		return Math.floor(Math.round((amount + transactionFlatFee) / (1 - transactionPercentFee) - amount));
	}

	return Math.floor(Math.round(amount * transactionPercentFee) + transactionFlatFee);
};

/**
 * Retrieve the donation fee rates
 *
 * @param isOfflineDonation
 */
exports.getFeeRates = function (isOfflineDonation) {
	let promise = Promise.resolve();
	if (isOfflineDonation) {
		promise = promise.then(function () {
			const repo = new SettingsRepository();
			return repo.batchGet([SettingHelper.SETTING_OFFLINE_TRANSACTION_FEE_PERCENTAGE, SettingHelper.SETTING_OOFFLINE_TRANSACTION_FEE_FLAT_RATE]).then(function (response) {
				let percent = 0;
				let flatRate = 0;
				_.forEach(response, function (setting) {
					if (setting.key === SettingHelper.SETTING_OFFLINE_TRANSACTION_FEE_PERCENTAGE) {
						percent = parseFloat(setting.value);
					} else if (setting.key === SettingHelper.SETTING_OOFFLINE_TRANSACTION_FEE_FLAT_RATE) {
						flatRate = parseInt(setting.value);
					}
				});

				return {
					percent: percent,
					flatRate: flatRate,
				}
			});
		});

	} else {
		promise = promise.then(function () {
			return {
				percent: .029,
				flatRate: 30,
			}
		});
	}

	return promise;
};

/**
 * Validate PaymentSpring payment
 *
 * @param {{}} data
 * @return {Promise}
 */
exports.validatePaymentSpringPayment = function (data) {
	return new Promise(function (resolve, reject) {
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

		paymentFields.forEach(function (param) {
			if (!data.hasOwnProperty(param)) {
				reject(new MissingRequiredParameter('Missing required parameter: payment.' + param));
			}
		});

		resolve();
	});
};