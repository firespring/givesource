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