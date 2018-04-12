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

const DonationHelper = require('./../helpers/donation');
const Model = require('./model');
const numeral = require('numeral');

/**
 * Donation constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Donation(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
Donation.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Donation.prototype.attributes = [
	'amountForNonprofit',
	'count',
	'donorUuid',
	'fees',
	'isAnonymous',
	'isFeeCovered',
	'isOfflineDonation',
	'nonprofitUuid',
	'paymentTransactionUuid',
	'subtotal',
	'subtotalChargedToCard',
	'total',
	'type',
	'note',

	// Donor
	'donorFirstName',
	'donorLastName',
	'donorEmail',
	'donorPhone',
	'donorAddress1',
	'donorAddress2',
	'donorCity',
	'donorState',
	'donorZip',

	// Nonprofit
	'nonprofitLegalName',
	'nonprofitAddress1',
	'nonprofitAddress2',
	'nonprofitAddress3',
	'nonprofitCity',
	'nonprofitState',
	'nonprofitZip',

	// Payment Transaction
	'creditCardName',
	'creditCardType',
	'creditCardLast4',
	'creditCardExpirationMonth',
	'creditCardExpirationYear',
	'creditCardZip',
	'paymentTransactionId',
	'paymentTransactionAmount',
	'paymentTransactionIsTestMode',
	'paymentTransactionStatus',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Donation.prototype.constraints = {
	amountForNonprofit: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	count: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 1
		}
	},
	donorUuid: {
		presence: false,
		uuid: 4,
	},
	fees: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	isAnonymous: {
		presence: true,
		type: 'boolean'
	},
	isFeeCovered: {
		presence: false,
		type: 'boolean'
	},
	isOfflineDonation: {
		presence: true,
		type: 'boolean'
	},
	nonprofitUuid: {
		presence: true,
		uuid: 4,
	},
	paymentTransactionUuid: function (value, attributes) {
		if (attributes.isOfflineDonation) {
			return {
				presence: false,
				uuid: 4,
			}
		} else {
			return {
				presence: true,
				uuid: 4
			}
		}
	},
	subtotal: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	total: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	type: {
		presence: true,
		inclusion: [DonationHelper.TYPE_BULK, DonationHelper.TYPE_SINGLE]
	},
	note: {
		presence: false,
		type: 'string',
	},

	// Donor
	donorFirstName: {
		presence: false,
		type: 'string'
	},
	donorLastName: {
		presence: false,
		type: 'string'
	},
	donorEmail: {
		presence: false,
		email: true,
		type: 'string',
	},
	donorPhone: {
		presence: false,
		type: 'string',
	},
	donorAddress1: {
		presence: false,
		type: 'string',
	},
	donorAddress2: {
		presence: false,
		type: 'string',
	},
	donorCity: {
		presence: false,
		type: 'string',
	},
	donorState: {
		presence: false,
		type: 'string'
	},
	donorZip: {
		presence: false,
		type: 'string'
	},

	// Nonprofit
	nonprofitLegalName: {
		presence: false,
		type: 'string',
	},
	nonprofitAddress1: {
		presence: false,
		type: 'string'
	},
	nonprofitAddress2: {
		presence: false,
		type: 'string'
	},
	nonprofitAddress3: {
		presence: false,
		type: 'string'
	},
	nonprofitCity: {
		presence: false,
		type: 'string'
	},
	nonprofitState: {
		presence: false,
		type: 'string'
	},
	nonprofitZip: {
		presence: false,
		type: 'string'
	},

	// Payment Transaction
	creditCardName: {
		presence: false,
		type: 'string',
	},
	creditCardType: {
		presence: false,
		type: 'string',
	},
	creditCardLast4: {
		presence: false,
		type: 'string',
	},
	creditCardExpirationMonth: {
		presence: false,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	creditCardExpirationYear: {
		presence: false,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	creditCardZip: {
		presence: false,
		type: 'string'
	},
	paymentTransactionId: {
		presence: false,
		type: 'string'
	},
	paymentTransactionAmount: {
		presence: false,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	paymentTransactionIsTestMode: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 0,
			lessThanOrEqualTo: 1
		}
	},
	paymentTransactionStatus: {
		presence: false,
		type: 'string'
	},
	subtotalChargedToCard: {
		presence: false,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
};

/**
 * Default values for this model
 *
 * @return {{}}
 */
Donation.prototype.defaults = function () {
	return {
		count: 1,
		isFeeCovered: false,
		isOfflineDonation: false,
		subtotalChargedToCard: 0,
		type: DonationHelper.TYPE_SINGLE,
	};
};

/**
 * Attribute mutators for this model
 *
 * @type {{}}
 */
Donation.prototype.mutators = {
	amountForNonprofit: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
	fees: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
	isFeeCovered: function (value) {
		return value ? 'Yes' : 'No';
	},
	isOfflineDonation: function (value) {
		return value ? 'Yes' : 'No';
	},
	subtotal: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
	subtotalChargedToCard: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
	total: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
};

/**
 * Event fired for this model before validation
 */
Donation.prototype.beforeValidate = function () {
	this.amountForNonprofit = this.total - this.fees;
	this.subtotalChargedToCard = this.isOfflineDonation ? 0 : this.total;
	this.paymentTransactionIsTestMode = this.paymentTransactionIsTestMode ? 1 : 0;
};

/**
 * Event fired for this model before saving
 */
Donation.prototype.beforeSave = function () {
	this.amountForNonprofit = this.total - this.fees;
	this.subtotalChargedToCard = this.isOfflineDonation ? 0 : this.total;
	this.paymentTransactionIsTestMode = this.paymentTransactionIsTestMode ? 1 : 0;
};

module.exports = Donation;