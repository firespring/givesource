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
const NonprofitHelper = require('./../helpers/nonprofit');

/**
 * Nonprofit constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Nonprofit(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
Nonprofit.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Nonprofit.prototype.attributes = [
	'address1',
	'address2',
	'address3',
	'category1',
	'category2',
	'category3',
	'city',
	'donationsCount',
	'donationsFees',
	'donationsFeesCovered',
	'donationsSubtotal',
	'donationsTotal',
	'legalName',
	'legalNameSearch',
	'longDescription',
	'phone',
	'shortDescription',
	'slug',
	'state',
	'status',
	'taxId',
	'zip',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Nonprofit.prototype.constraints = {
	address1: {
		presence: true,
		type: 'string'
	},
	address2: {
		presence: false,
		type: 'string'
	},
	address3: {
		presence: false,
		type: 'string'
	},
	category1: {
		presence: true,
		type: 'string',
	},
	category2: {
		presence: false,
		type: 'string',
	},
	category3: {
		presence: false,
		type: 'string',
	},
	city: {
		presence: true,
		type: 'string'
	},
	donationsCount: {
		presence: true,
		numericality: {
			onlyInteger: true
		}
	},
	donationsFees: {
		presence: true,
		numericality: true
	},
	donationsFeesCovered: {
		presence: true,
		numericality: true
	},
	donationsSubtotal: {
		presence: true,
		numericality: true
	},
	donationsTotal: {
		presence: true,
		numericality: true
	},
	legalName: {
		presence: true,
		type: 'string',
	},
	legalNameSearch: {
		presence: true,
		type: 'string',
	},
	longDescription: {
		presence: false,
		type: 'string'
	},
	phone: {
		presence: false,
		type: 'string|number'
	},
	shortDescription: {
		presence: false,
		type: 'string'
	},
	slug: {
		presence: false,
		type: 'string'
	},
	state: {
		presence: true,
		type: 'string',
	},
	status: {
		presence: true,
		inclusion: [NonprofitHelper.STATUS_ACTIVE, NonprofitHelper.STATUS_DENIED, NonprofitHelper.STATUS_PENDING, NonprofitHelper.STATUS_REVOKED]
	},
	taxId: {
		presence: true,
		type: 'string'
	},
	zip: {
		presence: true,
		type: 'string|number'
	}
};

/**
 * Default values for this model
 *
 * @return {{}}
 */
Nonprofit.prototype.defaults = function () {
	return {
		donationsCount: 0,
		donationsFees: 0,
		donationsFeesCovered: 0,
		donationsSubtotal: 0,
		donationsTotal: 0,
		status: NonprofitHelper.STATUS_PENDING
	};
};

/**
 * Event fired for this model before saving
 */
Nonprofit.prototype.beforeSave = function () {
	this.legalNameSearch = this.legalName.toLowerCase();
};

module.exports = Nonprofit;