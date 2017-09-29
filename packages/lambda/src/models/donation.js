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

const Model = require('../models/model');

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
	'amountInCents',
	'donorUuid',
	'feesInCents',
	'isAnonymous',
	'isFeeCovered',
	'isOfflineDonation',
	'nonprofitUuid',
	'paymentTransactionUuid',
	'totalInCents'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Donation.prototype.constraints = {
	amountInCents: {
		presence: true,
		type: 'string|number'
	},
	donorUuid: {
		presence: false,
		uuid: 4
	},
	feesInCents: {
		presence: true,
		type: 'string|number'
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
		presence: false,
		type: 'boolean'
	},
	nonprofitUuid: {
		presence: true,
		uuid: 4
	},
	paymentTransactionUuid: {
		presence: true,
		uuid: 4
	},
	totalInCents: {
		presence: true,
		type: 'string|number'
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

module.exports = Donation;