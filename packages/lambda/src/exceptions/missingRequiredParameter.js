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

const HttpException = require('./http');

/**
 * MissingRequiredParameter constructor
 *
 * @param {String} [message]
 * @constructor
 */
function MissingRequiredParameter (message) {
	HttpException.call(this, message);

	this._status = 400;
	this._type = 'missing_required_parameter';
	this.defaultMessage = 'A required parameter was not specified for this request.';
}

/**
 * Extend the base HttpException
 *
 * @type {HttpException}
 */
MissingRequiredParameter.prototype = new HttpException();

module.exports = MissingRequiredParameter;