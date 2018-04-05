/*
 * Copyright 2018 Firespring, Inc.
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
	'logoFileUuid',
	'longDescription',
	'phone',
	'receiveDonationNotifications',
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
		type: 'number',
	},
	category2: {
		presence: false,
		type: 'number',
	},
	category3: {
		presence: false,
		type: 'number',
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
	logoFileUuid: {
		presence: false,
		uuid: 4
	},
	longDescription: {
		presence: false,
		type: 'string'
	},
	phone: {
		presence: false,
		type: 'string|number'
	},
	receiveDonationNotifications: {
		presence: false,
		type: 'boolean',
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
		receiveDonationNotifications: true,
		status: NonprofitHelper.STATUS_PENDING
	};
};

/**
 * Event fired for this model before validation
 */
Nonprofit.prototype.beforeValidate = function () {
	this.legalNameSearch = this.legalName.toLowerCase();
};

/**
 * Event fired for this model before saving
 */
Nonprofit.prototype.beforeSave = function () {
	this.legalNameSearch = this.legalName.toLowerCase();
};

module.exports = Nonprofit;