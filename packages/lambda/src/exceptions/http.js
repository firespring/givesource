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

const Exception = require('./exception');

/**
 * HttpException constructor
 *
 * @param {String} [message]
 * @constructor
 */
function HttpException (message) {
	Exception.call(this, message);

	this._status = 500;
	this._type = 'internal_error';
	this.defaultMessage = 'The server encountered an internal error. Please retry the request.';
	this._context = null;
}

/**
 * Extend the base Exception
 *
 * @type {Exception}
 */
HttpException.prototype = new Exception();

/**
 * Set the Exception's type
 *
 * @param {String} type
 * @return {HttpException}
 */
HttpException.prototype.type = function (type) {
	this._type = type;
	return this;
};

/**
 * Set the Exception's status
 *
 * @param {int} status
 * @return {HttpException}
 */
HttpException.prototype.status = function (status) {
	this._status = status;
	return this;
};

/**
 * Set the Exception's context
 *
 * @param {{}} context
 * @return {HttpException}
 */
HttpException.prototype.context = function (context) {
	this._context = context;
	return this;
};

/**
 * String representation of the Exception
 *
 * @return {String}
 */
HttpException.prototype.toString = function () {
	return JSON.stringify({
		httpStatus: this._status,
		type: this._type,
		message: this._message || this.getDefaultMessage(),
		requestId: this._context && this._context.awsRequestId ? this._context.awsRequestId : ''
	});
};

module.exports = HttpException;