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

const numeral = require('numeral');

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
		transform: function (value) {
			const date = new Date(value);
			return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
		}
	},
	{
		label: 'Nonprofit',
		value: 'nonprofitLegalName',
	},
	{
		label: 'Is Offline',
		value: 'isOfflineDonation',
		transform: function (value) {
			return value ? 'Yes' : 'No';
		}
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
		transform: function (value) {
			return numeral(value / 100).format('$0,0.00');
		}
	},
	{
		label: 'Is Fee Covered',
		value: 'isFeeCovered',
		transform: function (value) {
			return value ? 'Yes' : 'No';
		}
	},
	{
		label: 'Donation Fee',
		value: 'fees',
		transform: function (value) {
			return numeral(value / 100).format('$0,0.00');
		}
	},
	{
		label: 'Donation Total',
		value: 'total',
		transform: function (value) {
			return numeral(value / 100).format('$0,0.00');
		}
	},
	{
		label: 'Payment ID',
		value: 'paymentTransactionId',
	},
	{
		label: 'Payment Amount',
		value: 'paymentTransactionAmount',
		transform: function (value) {
			return numeral(value / 100).format('$0,0.00');
		}
	},
	{
		label: 'Payment Status',
		value: 'paymentTransactionStatus',
	},
	{
		label: 'Is Test Mode',
		value: 'paymentTransactionIsTestMode',
		transform: function (value) {
			return value ? 'Yes' : 'No';
		}
	}
];

/**
 * Calculate donation fees
 *
 * @param {number} amount
 * @param {number} transactionFlatFee
 * @param {number} transactionPercentFee
 * @return {number}
 */
exports.calculateFees = function (amount, transactionFlatFee, transactionPercentFee) {
	return Math.floor(Math.round((amount + transactionFlatFee) / (1 - transactionPercentFee) - amount));
};