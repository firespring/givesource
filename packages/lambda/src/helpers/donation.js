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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../../.env`});

const SettingsRepository = require('./../repositories/settings');
const SettingHelper = require('./setting');

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
	if(!isOfflineDonation || isFeeCovered) {
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