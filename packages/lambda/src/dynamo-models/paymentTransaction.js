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