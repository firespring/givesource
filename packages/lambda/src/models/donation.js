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
		type: 'number'
	},
	donorUuid: {
		presence: false,
		uuid: 4,
	},
	feesInCents: {
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
		presence: false,
		type: 'boolean'
	},
	nonprofitUuid: {
		presence: true,
		uuid: 4,
	},
	paymentTransactionUuid: {
		presence: true,
		uuid: 4
	},
	totalInCents: {
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
 * CloudSearch index fields for this model
 *
 * @return {{}}
 */
Donation.prototype.cloudSearchIndexFields = {
	amountInCents: {
		IndexFieldName: 'amount_in_cents',
		IndexFieldType: 'int',
	},
	donorUuid: {
		IndexFieldName: 'donor_uuid',
		IndexFieldType: 'text',
	},
	feesInCents: {
		IndexFieldName: 'fees_in_cents',
		IndexFieldType: 'int',
	},
	isAnonymous: {
		IndexFieldName: 'is_anonymous',
		IndexFieldType: 'int',
	},
	isFeeCovered: {
		IndexFieldName: 'is_fee_covered',
		IndexFieldType: 'int',
	},
	isOfflineDonation: {
		IndexFieldName: 'is_offline_donation',
		IndexFieldType: 'int',
	},
	nonprofitUuid: {
		IndexFieldName: 'nonprofit_uuid',
		IndexFieldType: 'text',
	},
	paymentTransactionUuid: {
		IndexFieldName: 'payment_transaction_uuid',
		IndexFieldType: 'text',
	},
	totalInCents: {
		IndexFieldName: 'total_in_cents',
		IndexFieldType: 'int',
	}
};

module.exports = Donation;