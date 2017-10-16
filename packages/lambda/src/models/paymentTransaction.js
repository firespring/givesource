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
	'creditCardCvvResult',
	'creditCardExpirationMonth',
	'creditCardExpirationYear',
	'creditCardLast4',
	'creditCardName',
	'creditCardType',
	'creditCardZipCode',
	'isTestMode',
	'total',
	'transactionId'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
PaymentTransaction.prototype.constraints = {
	billingZip: {
		presence: true,
		type: 'string|number'
	},
	creditCardCvvResult: {
		presence: true,
		type: 'string|number'
	},
	creditCardExpirationMonth: {
		presence: true,
		type: 'string|number'
	},
	creditCardExpirationYear: {
		presence: true,
		type: 'string|number'
	},
	creditCardLast4: {
		presence: true,
		type: 'string|number'
	},
	creditCardName: {
		presence: true,
		type: 'string'
	},
	creditCardZipCode: {
		presence: true,
		type: 'string|number'
	},
	isTestMode: {
		presence: true,
		type: 'boolean'
	},
	total: {
		presence: true,
		type: 'string|number'
	},
	transactionId: {
		presence: true,
		type: 'string'
	}
};

module.exports = PaymentTransaction;