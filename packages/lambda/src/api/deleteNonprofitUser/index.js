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
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource')
const UsersRepository = require('./../../repositories/users')

exports.handle = function (event, context, callback) {
  const cognito = new Cognito()
  const repository = new UsersRepository()
  const request = new Request(event, context)
  request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_id'), ['SuperAdmin', 'Admin']))

  request.validate().then(function () {
    return repository.get(request.urlParam('user_id'))
  }).then(function (user) {
    return cognito.deleteUser(process.env.AWS_REGION, process.env.USER_POOL_ID, user.cognitoUsername)
  }).then(function () {
    return repository.delete(request.urlParam('user_id'))
  }).then(function () {
    callback()
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
