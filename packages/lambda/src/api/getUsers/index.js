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
const Cognito = require('./../../aws/cognito')
const HttpException = require('./../../exceptions/http')
const Request = require('./../../aws/request')
const UsersRepository = require('./../../repositories/users')
const UserGroupMiddleware = require('./../../middleware/userGroup')

exports.handle = function (event, context, callback) {
  const cognito = new Cognito()
  const repository = new UsersRepository()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']))
  const userPoolId = process.env.USER_POOL_ID

  const results = []
  request.validate().then(function () {
    return repository.getAdminUsers()
  }).then(function (users) {
    let promise = Promise.resolve()

    users.forEach(function (user) {
      const result = user
      promise = promise.then(function () {
        if (!user.cognitoUsername) {
          // user's without username shouldn't exist, but will throw on cognito.listGroupsForUser if they don't
          // testing/garbage data can cause a user without a username
          result.groups = []
          results.push(result)
          return
        }
        return cognito.listGroupsForUser(process.env.AWS_REGION, userPoolId, user.cognitoUsername).then(function (response) {
          result.groups = response.hasOwnProperty('Groups') ? response.Groups.map(function (group) {
            return group.GroupName
          }) : []
          results.push(result)
        })
      })
    })

    return promise
  }).then(function () {
    callback(null, results)
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
