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
 * Donor constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Donor(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 *@type {model}
 */
Donor.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Donor.prototype.attributes = [
	'address1',
	'address2',
	'city',
	'email',
	'name',
	'phone',
	'state',
	'totalAmountInCents',
	'zip'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Donor.prototype.constraints = {
	address1: {
		presence: true,
		type: 'string'
	},
	address2: {
		presence: false,
		type: 'string'
	},
	city: {
		presence: true,
		type: 'string'
	},
	email: {
		presence: true,
		email: true
	},
	name: {
		presence: true,
		type: 'string'
	},
	phone: {
		presence: false,
		type: 'string|number'
	},
	state: {
		presence: true,
		type: 'string'
	},
	totalAmountInCents: {
		presence: true,
		type: 'string|number'
	},
	zip: {
		presence: true,
		type: 'string|number'
	}
};

/**
 * CloudSearch index fields for this model
 *
 * @return {{}}
 */
Donor.prototype.cloudSearchIndexFields = {
	address1: {
		IndexFieldName: 'address1',
		IndexFieldType: 'text',
	},
	address2: {
		IndexFieldName: 'address2',
		IndexFieldType: 'text',
	},
	city: {
		IndexFieldName: 'city',
		IndexFieldType: 'text',
	},
	email: {
		IndexFieldName: 'email',
		IndexFieldType: 'text',
	},
	name: {
		IndexFieldName: 'name',
		IndexFieldType: 'text',
	},
	phone: {
		IndexFieldName: 'phone',
		IndexFieldType: 'text',
	},
	state: {
		IndexFieldName: 'state',
		IndexFieldType: 'text',
	},
	totalAmountInCents: {
		IndexFieldName: 'total_amount_in_cents',
		IndexFieldType: 'int',
	},
	zip: {
		IndexFieldName: 'zip',
		IndexFieldType: 'text',
	}
};

module.exports = Donor;