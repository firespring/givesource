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

const logger = require('./../helpers/log');
const Middleware = require('./../middleware/middleware');
const MissingRequiredHeaderException = require('./../exceptions/missingRequiredHeader');
const MissingRequiredParameter = require('./../exceptions/missingRequiredParameter');
const MissingRequiredQueryParameterException = require('./../exceptions/missingRequiredQueryParameter');

/**
 * Request constructor
 *
 * @param {{}} event
 * @param {{}} context
 *
 * @constructor
 */
function Request(event, context) {
	this.context = context;
	this._requiredParameters = [];
	this._requiredQueryParameters = [];
	this._requiredHeaders = [];

	if (this.context && this.context.hasOwnProperty('functionName')) {
		logger.log(`${this.context.functionName} event: %j`, event);
	}

	this._middleware = [];
	this._populateRequest(event);
}

/**
 * Add Request middleware
 */
Request.prototype.middleware = function (middleware) {
	if (middleware instanceof Middleware) {
		this._middleware.push(middleware);
	}
	return this;
};

/**
 * Process Request middleware
 *
 * @return {Promise}
 */
Request.prototype._processMiddleware = function () {
	const request = this;

	let promise = Promise.resolve();
	request._middleware.forEach(function (middleware) {
		promise = promise.then(function () {
			middleware.prepare(request.user());
			return middleware.handle();
		});
	});

	return promise;
};

/**
 * Build this Request
 *
 * @param {{}} event
 * @private
 */
Request.prototype._populateRequest = function (event) {
	this.method = (event.hasOwnProperty('method')) ? event.method : null;

	this._body = (event.hasOwnProperty('body')) ? event.body : {};
	this._headers = (event.hasOwnProperty('headers')) ? event.headers : {};
	this._queryParameters = (event.hasOwnProperty('query')) ? event.query : {};
	this._urlParameters = (event.hasOwnProperty('params')) ? event.params : {};
	this._user = (event.hasOwnProperty('user')) ? event.user : null;

	return this;
};

/**
 * Set this Request's required body parameters
 *
 * @param {[]} keys
 * @return {Request}
 */
Request.prototype.parameters = function (keys) {
	this._requiredParameters = keys;
	return this;
};

/**
 * Set this Request's required query parameters
 *
 * @param {[]} keys
 * @return {Request}
 */
Request.prototype.queryParameters = function (keys) {
	this._requiredQueryParameters = keys;
	return this;
};

/**
 * Set this Request's required headers
 *
 * @param {[]} keys
 * @return {Request}
 */
Request.prototype.headers = function (keys) {
	this._requiredHeaders = keys;
	return this;
};

/**
 * Validate the Request
 *
 * @return {Promise}
 */
Request.prototype.validate = function () {
	const request = this;
	return new Promise(function (resolve, reject) {
		for (let i in request._requiredParameters) {
			const key = request._requiredParameters[i];
			if (!request._body.hasOwnProperty(key)) {
				return reject(new MissingRequiredParameter('Missing required parameter: ' + key));
			}
		}
		for (let i in request._requiredQueryParameters) {
			const key = request._requiredQueryParameters[i];
			if (!request._queryParameters.hasOwnProperty(key)) {
				return reject(new MissingRequiredQueryParameterException('Missing required query parameter: ' + key));
			}
		}
		for (let i in request._requiredHeaders) {
			const key = request._requiredHeaders[i];
			if (!request._headers.hasOwnProperty(key)) {
				return reject(new MissingRequiredHeaderException('Missing required header: ' + key));
			}
		}
		request._processMiddleware().then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Find a value from this Request
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*}
 */
Request.prototype.find = function (key, defaultValue) {
	if (this.get(key) !== null) {
		return this.get(key);
	} else if (this.urlParam(key) !== null) {
		return this.urlParam(key);
	} else if (this.queryParam(key) !== null) {
		return this.queryParam(key);
	} else if (this.header(key) !== null) {
		return this.header(key);
	} else if (defaultValue !== undefined) {
		return defaultValue;
	} else {
		return null;
	}
};

/**
 * Get a value from this Request's body
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.get = function (key, defaultValue) {
	if (this._body.hasOwnProperty(key)) {
		return this._body[key];
	}
	return (defaultValue !== undefined) ? defaultValue : null;
};

/**
 * Get a value from this Request's url parameters
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.urlParam = function (key, defaultValue) {
	if (this._urlParameters.hasOwnProperty(key)) {
		return this._urlParameters[key];
	}
	return (defaultValue !== undefined) ? defaultValue : null;
};

/**
 * Get a value from this Request's query parameters
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.queryParam = function (key, defaultValue) {
	if (this._queryParameters.hasOwnProperty(key)) {
		return this._queryParameters[key];
	}
	return (defaultValue !== undefined) ? defaultValue : null;
};

/**
 * Get a value from this Request's headers
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.header = function (key, defaultValue) {
	if (this._headers.hasOwnProperty(key)) {
		return this._headers[key];
	}
	return (defaultValue !== undefined) ? defaultValue : null;
};

/**
 * Get the user from the request
 *
 * @return {{}|null}
 */
Request.prototype.user = function () {
	return this._user;
};

module.exports = Request;