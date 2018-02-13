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

const Model = require('./model');
const numeral = require('numeral');

/**
 * paymentTransaction constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function PaymentTransaction(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
PaymentTransaction.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
PaymentTransaction.prototype.attributes = [
	'billingZip',
	'creditCardExpirationMonth',
	'creditCardExpirationYear',
	'creditCardLast4',
	'creditCardName',
	'creditCardType',
	'isTestMode',
	'transactionAmount',
	'transactionId',
	'transactionStatus'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
PaymentTransaction.prototype.constraints = {
	billingZip: {
		presence: true,
		type: 'string'
	},
	creditCardExpirationMonth: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	creditCardExpirationYear: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	creditCardLast4: {
		presence: true,
		type: 'string'
	},
	creditCardName: {
		presence: true,
		type: 'string'
	},
	creditCardType: {
		presence: true,
		type: 'string',
	},
	isTestMode: {
		presence: true,
		type: 'boolean'
	},
	transactionAmount: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true
		}
	},
	transactionId: {
		presence: true,
		type: 'string'
	},
	transactionStatus: {
		presence: false,
		type: 'string'
	}
};

/**
 * Attribute mutators for this model
 *
 * @type {{}}
 */
PaymentTransaction.prototype.mutators = {
	creditCardType: function (value) {
		switch (value) {
			case 'amex':
				return 'American Express';
			case 'discover':
				return 'Discover';
			case 'mastercard':
				return 'MasterCard';
			case 'visa':
				return 'Visa';
			default:
				return value;
		}
	},
	transactionAmount: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
};

module.exports = PaymentTransaction;