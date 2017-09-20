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