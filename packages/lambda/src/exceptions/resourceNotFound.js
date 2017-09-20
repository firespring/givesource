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

const HttpException = require('./http');

/**
 * ResourceNotFoundException constructor
 *
 * @param {String} [message]
 * @constructor
 */
function ResourceNotFoundException (message) {
	HttpException.call(this, message);

	this._status = 404;
	this._type = 'resource_not_found';
	this.defaultMessage = 'The specified resource does not exist.';
}

/**
 * Extend the base HttpException
 *
 * @type {HttpException}
 */
ResourceNotFoundException.prototype = new HttpException();

module.exports = ResourceNotFoundException;