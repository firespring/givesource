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
		inclusion: [MessageHelper.TYPE_CONTACT, MessageHelper.TYPE_FEEDBACK, MessageHelper.TYPE_NAME_CHANGE]
	}
};

module.exports = Message;