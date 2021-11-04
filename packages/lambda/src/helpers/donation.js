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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../../.env`});

const MissingRequiredParameter = require('./../exceptions/missingRequiredParameter');
const SettingsRepository = require('./../repositories/settings');
const SettingHelper = require('./setting');

exports.TYPE_BULK = 'BULK';
exports.TYPE_SINGLE = 'SINGLE';

exports.last4Fields = [
  {
    label: 'createdAt',
    value: 'createdAt'
  },
  {
    label: 'firstName',
    value: 'firstName'
  },
  {
    label: 'lastName',
    value: 'lastName'
  },
  {
    label: 'email',
    value: 'email'
  },
  {
    label: 'subtotalCharged',
    value: 'subtotalCharged'
  },
  {
    label: 'creditCardLast4',
    value: 'creditCardLast4'
  },
  {
    label: 'chargeInCents',
    value: 'chargeInCents'
  },
  {
    label: 'transactionId',
    value: 'transactionId'
  }
]

/**
 * Get fields for Report
 *
 * @type {[]}
 */
exports.reportFields = [
	{
		label: 'ID',
		value: 'id'
	},
	{
		label: 'Date',
		value: 'createdAt',
	},
	{
		label: 'Nonprofit',
		value: 'Nonprofit.legalName',
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
		value: 'Donor.firstName',
	},
	{
		label: 'Donor Last Name',
		value: 'Donor.lastName',
	},
	{
		label: 'Donor Address 1',
		value: 'Donor.address1',
	},
	{
		label: 'Donor Address 2',
		value: 'Donor.address2',
	},
	{
		label: 'Donor City',
		value: 'Donor.city',
	},
	{
		label: 'Donor State',
		value: 'Donor.state',
	},
	{
		label: 'Donor Zip',
		value: 'Donor.zip',
	},
	{
		label: 'Donor Email',
		value: 'Donor.email',
	},
	{
		label: 'Donor Phone Number',
		value: 'Donor.phone',
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
	const repo = new SettingsRepository();

	if (isOfflineDonation) {
		promise = promise.then(function () {
			return repo.batchGet([SettingHelper.SETTING_OFFLINE_TRANSACTION_FEE_PERCENTAGE, SettingHelper.SETTING_OFFLINE_TRANSACTION_FEE_FLAT_RATE]);
		});
	} else {
		promise = promise.then(function () {
			return repo.batchGet([SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE, SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE]);
		});
	}

	promise = promise.then(function (response) {
		let percent = 0;
		let flatRate = 0;
		_.forEach(response, function (setting) {
			if (setting.key === SettingHelper.SETTING_OFFLINE_TRANSACTION_FEE_PERCENTAGE || setting.key === SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE) {
				percent = parseFloat(setting.value);
			} else if (setting.key === SettingHelper.SETTING_OFFLINE_TRANSACTION_FEE_FLAT_RATE || setting.key === SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE) {
				flatRate = parseInt(setting.value);
			}
		});

		return {
			percent: percent,
			flatRate: flatRate,
		}
	});

	return promise;
};

/**
 * Format values for a bulk create
 *
 * @param {Object} model
 * @param {Object} data
 * @return {Object}
 */
exports.formatForBulkCreate = function (model, data) {
  return {
    'amountForNonprofit': typeof data.amountForNonprofit !== "undefined" ? data.amountForNonprofit : model.amountForNonprofit,
    'count': typeof data.count !== "undefined" ? data.count : model.count,
    'fees': typeof data.fees !== "undefined" ? data.fees : model.fees,
    'isAnonymous': typeof data.isAnonymous !== "undefined" ? data.isAnonymous : model.isAnonymous,
    'isFeeCovered': typeof data.isFeeCovered !== "undefined" ? data.isFeeCovered : model.isFeeCovered,
    'isOfflineDonation': typeof data.isOfflineDonation !== "undefined" ? data.isOfflineDonation : model.isOfflineDonation,
    'nonprofitId': typeof data.nonprofitId !== "undefined" ? data.nonprofitId : model.nonprofitId,
    'paymentTransactionIsTestMode': typeof data.paymentTransactionIsTestMode !== "undefined" ? data.paymentTransactionIsTestMode : model.paymentTransactionIsTestMode,
    'paymentTransactionId': typeof data.paymentTransactionId !== "undefined" ? data.paymentTransactionId : model.paymentTransactionId,
    'subtotal': typeof data.subtotal !== "undefined" ? data.subtotal : model.subtotal,
    'subtotalChargedToCard': typeof data.subtotalChargedToCard !== "undefined" ? data.subtotalChargedToCard : model.subtotalChargedToCard,
    'total': typeof data.total !== "undefined" ? data.total : model.total,
    'type': typeof data.type !== "undefined" ? data.type : model.type,
    'donorId': typeof data.donorId !== "undefined" ? data.donorId : model.donorId,
    'name': typeof data.name !== "undefined" ? data.name : model.name,
    'note': typeof data.note !== "undefined" ? data.note : model.note,
  }
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

/**
 * Validate each donation to make sure a nonprofitId is associated with it
 *
 * @param donations
 * @return {Promise<unknown>}
 */
exports.validateDonationsBeforeProcessing = function (donations) {
  return new Promise(function (resolve, reject) {
    donations.forEach(function (donation) {
      if (!donation.hasOwnProperty('nonprofitId')) {
        reject(new MissingRequiredParameter('Missing required parameter: donation.nonprofitId'))
      }
    });

    resolve();
  });
};