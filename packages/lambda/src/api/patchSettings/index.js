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
const SettingsRepository = require('./../../repositories/settings')
const HttpException = require('./../../exceptions/http')
const Lambda = require('./../../aws/lambda')
const Request = require('./../../aws/request')
const UserGroupMiddleware = require('./../../middleware/userGroup')
const DynamicContentHelper = require('./../../helpers/dynamicContent')

exports.handle = function (event, context, callback) {
  const lambda = new Lambda()
  const repository = new SettingsRepository()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['settings'])
  const keys = request.get('settings', []).map(function (setting) {
    return setting.key
  })

  const settings = []
  request.validate().then(function () {
    return repository.batchGet(keys)
  }).then(function (models) {
    let promise = Promise.resolve()
    request.get('settings', []).forEach(function (data) {
      promise = promise.then(function () {
        const model = _.find(models, { key: data.key })
        if (typeof model !== 'undefined') {
          return model
        } else {
          return repository.populate(data)
        }
      }).then(function (model) {
        if (Array.isArray(data.value) || typeof data.value === 'object') {
          delete data.value
        }
        return repository.upsert(model, data)
      }).then(function (savedModel) {
        settings.push(savedModel[0])
      }).catch(function (err) {
        (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
      })
    })
    return promise
  }).then(function () {
    const socialSharingData = {
      EVENT_TITLE: null,
      SOCIAL_SHARING_IMAGE: null,
      SOCIAL_SHARING_DESCRIPTION: null,
      SEO_DESCRIPTION: null
    }
    request.get('settings', []).forEach(setting => {
      if (socialSharingData.hasOwnProperty(setting.key)) {
        socialSharingData[setting.key] = setting.value
      }
    })
    lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiDistributionInvalidation', { paths: ['/settings*'] }, 'RequestResponse')
    lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-PutSocialSharing', socialSharingData, 'RequestResponse')
    lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-PutSEO', socialSharingData, 'RequestResponse')
  }).then(function () {
    return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse')
  }).then(function () {
    return DynamicContentHelper.regenerateDynamicContent(_.map(settings, 'key'), process.env.AWS_REGION, process.env.AWS_STACK_NAME, false)
  }).then(function () {
    callback()
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
