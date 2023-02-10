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

const HttpException = require('./../../exceptions/http')
const Lambda = require('./../../aws/lambda')
const MessagesRepository = require('./../../repositories/messages')
const Request = require('./../../aws/request')

exports.handle = function (event, context, callback) {
  const lambda = new Lambda()
  const repository = new MessagesRepository()
  const request = new Request(event, context)

  let message
  request.validate().then(function () {
    return repository.populate(request._body)
  }).then(function (message) {
    return repository.upsert(message, {})
  }).then(function (response) {
    message = response
    const body = {
      message: message
    }
    lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendContactMessageEmail', { body: body })
  }).then(function () {
    callback(null, message)
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
