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

const _ = require('lodash')
const InvalidPermissionsException = require('./../exceptions/invalidPermissions')
const Middleware = require('./middleware')
const UsersRepository = require('../repositories/users')

/**
 * NonprofitResourceMiddleware constructor
 *
 * @param {String} nonprofitId
 * @param {[]} userGroups
 * @constructor
 */
function NonprofitResourceMiddleware (nonprofitId, userGroups) {
  this.nonprofitId = nonprofitId
  this.userGroups = userGroups
}

/**
 * Extend the base Middleware
 *
 * @type {Middleware}
 */
NonprofitResourceMiddleware.prototype = new Middleware()

/**
 * Handle the middleware
 *
 * @return {Promise}
 */
NonprofitResourceMiddleware.prototype.handle = function () {
  const middleware = this
  const usersRepository = new UsersRepository()
  return new Promise(function (resolve, reject) {
    if (middleware.user.groups && _.intersection(middleware.user.groups, middleware.userGroups).length > 0) {
      return resolve()
    }

    if (middleware.user.cognitoUsername) {
      usersRepository.getByCognitoUsername(middleware.user.cognitoUsername).then(function (user) {
        if (parseInt(middleware.nonprofitId) === parseInt(user.nonprofitId)) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('An unexpected error occurred'))
        }
      }).then(function () {
        return resolve()
      }).catch(function () {
        return reject(new InvalidPermissionsException())
      })
    } else {
      reject(new InvalidPermissionsException())
    }
  })
}

module.exports = NonprofitResourceMiddleware
