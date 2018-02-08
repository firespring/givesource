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