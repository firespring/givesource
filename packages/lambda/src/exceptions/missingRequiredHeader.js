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

const HttpException = require('./http')

/**
 * MissingRequiredHeaderException constructor
 *
 * @param {String} [message]
 * @constructor
 */
function MissingRequiredHeaderException (message) {
  HttpException.call(this, message)

  this._status = 400
  this._type = 'missing_required_header'
  this.defaultMessage = 'A required HTTP header was not specified.'
}

/**
 * Extend the base HttpException
 *
 * @type {HttpException}
 */
MissingRequiredHeaderException.prototype = new HttpException()

module.exports = MissingRequiredHeaderException
