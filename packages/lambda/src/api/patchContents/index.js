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

const ContentsRepository = require('./../../repositories/contents')
const HttpException = require('./../../exceptions/http')
const Lambda = require('./../../aws/lambda')
const Request = require('./../../aws/request')
const UserGroupMiddleware = require('./../../middleware/userGroup')

exports.handle = function (event, context, callback) {
  const lambda = new Lambda()
  const repository = new ContentsRepository()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['contents'])
  const keys = request.get('contents', []).map(function (content) {
    return content.id
  })

  request.validate().then(function () {
    return repository.batchGetById(keys)
  }).then(function (oldContents) {
    let promise = Promise.resolve()
    request.get('contents', []).map(function (content) {
      promise = promise.then(function () {
        if (Array.isArray(content.value) || typeof content.value === 'object') {
          content.value = ''
        }
        const oldContent = _.find(oldContents, { id: content.id })
        return repository.upsert(oldContent, content)
      })
    })
    return promise
  }).then(function () {
    lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiDistributionInvalidation', { paths: ['/contents*'] }, 'RequestResponse')
    return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse')
  }).then(function () {
    callback()
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
