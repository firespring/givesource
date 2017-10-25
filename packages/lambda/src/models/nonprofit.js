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
	'donationsSum',
	'legalName',
	'longDescription',
	'phone',
	'shortDescription',
	'slug',
	'state',
	'status',
	'taxId',
	'zip'
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
	donationsSum: {
		presence: true,
		numericality: true
	},
	legalName: {
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
		presence: true,
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
		donationsSum: 0,
		status: NonprofitHelper.STATUS_PENDING
	};
};

/**
 * CloudSearch index fields for this model
 *
 * @return {{}}
 */
Nonprofit.prototype.cloudSearchIndexFields = {
	address1: {
		IndexFieldName: 'address1',
		IndexFieldType: 'text',
	},
	address2: {
		IndexFieldName: 'address2',
		IndexFieldType: 'text'
	},
	address3: {
		IndexFieldName: 'address3',
		IndexFieldType: 'text',
	},
	category1: {
		IndexFieldName: 'category1',
		IndexFieldType: 'text',
	},
	category2: {
		IndexFieldName: 'category2',
		IndexFieldType: 'text',
	},
	category3: {
		IndexFieldName: 'category3',
		IndexFieldType: 'text',
	},
	city: {
		IndexFieldName: 'city',
		IndexFieldType: 'text',
	},
	donationsCount: {
		IndexFieldName: 'donations_count',
		IndexFieldType: 'int',
	},
	donationsSum: {
		IndexFieldName: 'donations_sum',
		IndexFieldType: 'int',
	},
	legalName: {
		IndexFieldName: 'legal_name',
		IndexFieldType: 'text',
	},
	longDescription: {
		IndexFieldName: 'long_description',
		IndexFieldType: 'text',
	},
	phone: {
		IndexFieldName: 'phone',
		IndexFieldType: 'text',
	},
	shortDescription: {
		IndexFieldName: 'short_description',
		IndexFieldType: 'text',
	},
	slug: {
		IndexFieldName: 'slug',
		IndexFieldType: 'text',
	},
	state: {
		IndexFieldName: 'state',
		IndexFieldType: 'text',
	},
	status: {
		IndexFieldName: 'status',
		IndexFieldType: 'text',
	},
	taxId: {
		IndexFieldName: 'tax_id',
		IndexFieldType: 'text',
	},
	zip: {
		IndexFieldName: 'zip',
		IndexFieldType: 'text',
	}
};

module.exports = Nonprofit;