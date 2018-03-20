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