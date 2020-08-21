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