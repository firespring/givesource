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

/**
 * Exception constructor
 *
 * @param {String} [message]
 * @constructor
 */
function Exception(message) {
	this._message = message;
}

/**
 * Default Exception message
 *
 * @type {string}
 */
Exception.prototype.defaultMessage = '';

/**
 * Set the Exception's default message.
 *
 * @return {string}
 */
Exception.prototype._defaultMessage = 'An unexpected exception occurred.';

/**
 * Get the Exception's default message.
 *
 * @return {string}
 */
Exception.prototype.getDefaultMessage = function () {
	return this.defaultMessage ? this.defaultMessage : this._defaultMessage;
};

/**
 * Set the Exception's message
 *
 * @param {String} message
 * @return {Exception}
 */
Exception.prototype.message = function (message) {
	this._message = message;
	return this;
};

/**
 * String representation of the Exception
 *
 * @return {String}
 */
Exception.prototype.toString = function () {
	return JSON.stringify({
		message: this._message || this.getDefaultMessage()
	});
};

module.exports = Exception;