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

const MessageHelper = require('./../helpers/message');
const Model = require('./model');

/**
 * Message constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Message(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
Message.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Message.prototype.attributes = [
	'email',
	'message',
	'name',
	'phone',
	'type'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Message.prototype.constraints = {
	email: {
		presence: true,
		email: true
	},
	message: {
		presence: true,
		type: 'string'
	},
	name: {
		presence: true,
		type: 'string'
	},
	phone: {
		presence: false,
		type: 'string|number'
	},
	type: {
		presence: true,
		inclusion: [MessageHelper.TYPE_CONTACT, MessageHelper.TYPE_FEEDBACK]
	}
};

module.exports = Message;