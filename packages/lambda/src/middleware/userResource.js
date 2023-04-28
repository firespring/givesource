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

const InvalidPermissionsException = require('./../exceptions/invalidPermissions')
const Middleware = require('./middleware')

/**
 * UserResourceMiddleware constructor
 *
 * @param {String} cognitoUsername
 * @constructor
 */
function UserResourceMiddleware (cognitoUsername) {
  this.cognitoUsername = cognitoUsername
}

/**
 * Extend the base Middleware
 *
 * @type {Middleware}
 */
UserResourceMiddleware.prototype = new Middleware()

/**
 * Handle the middleware
 *
 * @return {Promise}
 */
UserResourceMiddleware.prototype.handle = function () {
  const middleware = this
  return new Promise(function (resolve, reject) {
    if (middleware.user.cognitoUsername === middleware.cognitoUsername) {
      return resolve()
    }

    reject(new InvalidPermissionsException())
  })
}

module.exports = UserResourceMiddleware
