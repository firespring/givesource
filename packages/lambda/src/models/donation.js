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
	'donorUuid',
	'fees',
	'isAnonymous',
	'isFeeCovered',
	'isOfflineDonation',
	'nonprofitUuid',
	'paymentTransactionUuid',
	'subtotal',
	'total'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Donation.prototype.constraints = {
	donorUuid: {
		presence: false,
		uuid: 4,
	},
	fees: {
		presence: true,
		type: 'number'
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
		type: 'number'
	},
	total: {
		presence: true,
		type: 'number'
	}
};

/**
 * Default values for this model
 *
 * @return {{}}
 */
Donation.prototype.defaults = function () {
	return {
		isFeeCovered: false,
		isOfflineDonation: false
	};
};

/**
 * Attribute mutators for this model
 *
 * @type {{}}
 */
Donation.prototype.mutators = {
	fees: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
	subtotal: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
	total: function (value) {
		return numeral(value / 100).format('$0,0.00');
	},
};

module.exports = Donation;