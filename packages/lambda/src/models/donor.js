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
	'firstName',
	'lastName',
	'phone',
	'state',
	'zip'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Donor.prototype.constraints = {
	address1: {
		presence: false,
		type: 'string'
	},
	address2: {
		presence: false,
		type: 'string'
	},
	city: {
		presence: false,
		type: 'string'
	},
	email: {
		presence: false,
		email: true,
		type: 'string'
	},
	firstName: {
		presence: true,
		type: 'string'
	},
	lastName: {
		presence: true,
		type: 'string'
	},
	phone: {
		presence: false,
		type: 'string'
	},
	state: {
		presence: false,
		type: 'string'
	},
	zip: {
		presence: false,
		type: 'string'
	}
};

module.exports = Donor;