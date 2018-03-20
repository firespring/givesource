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

/**
 * User constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function User(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
User.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
User.prototype.attributes = [
	'cognitoUuid',
	'email',
	'lastName',
	'firstName',
	'isVerified',
	'nonprofitUuid',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
User.prototype.constraints = {
	cognitoUuid: {
		presence: false,
		uuid: 4
	},
	email: {
		presence: true,
		email: true
	},
	lastName: {
		presence: false,
		type: 'string'
	},
	firstName: {
		presence: false,
		type: 'string'
	},
	isVerified: {
		presence: false,
		type: 'boolean'
	},
	nonprofitUuid: {
		presence: false,
		uuid: 4
	}
};

/**
 * Default values for this model
 *
 * @return {{}}
 */
User.prototype.defaults = function () {
	return {
		isVerified: false,
	};
};

module.exports = User;