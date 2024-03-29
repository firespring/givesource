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

const DonorsRepository = require('./../../repositories/donors')
const HttpException = require('./../../exceptions/http')
const Lambda = require('./../../aws/lambda')
const Request = require('./../../aws/request')
const UserGroupMiddleware = require('./../../middleware/userGroup')

exports.handle = function handle (event, context, callback) {
  const lambda = new Lambda()
  const repository = new DonorsRepository()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']))

  let donor
  request.validate().then(() => {
    if (request.get('email')) {
      return repository.queryEmail(request.get('email'))
    }
    return Promise.resolve()
  }).then((model) => {
    if (model) {
      donor = model
    }
  }).then(() => {
    return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse')
  }).then(() => {
    return repository.upsert(donor, request._body)
  }).then((response) => {
    callback(null, response)
  }).catch((err) => {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
