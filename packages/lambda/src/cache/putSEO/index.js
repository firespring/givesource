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

const logger = require('./../../helpers/log')
const S3 = require('./../../aws/s3')
const SettingsRepository = require('./../../repositories/settings')
const RenderHelper = require('./../../helpers/render')

exports.handle = function (event, context, callback) {
  logger.log('put social sharing cache event: %j', event)
  const settingsRepository = new SettingsRepository()
  const s3 = new S3()

  const seoDefaults = {
    EVENT_TITLE: event.EVENT_TITLE,
    SEO_DESCRIPTION: event.SEO_DESCRIPTION
  }

  const data = {
    description: null,
    event_title: null,
    title: null
  }

  Promise.resolve().then(() => {
    return settingsRepository.batchGet(Object.keys(seoDefaults))
  }).then(response => {
    response.forEach(setting => {
      if (seoDefaults.hasOwnProperty(setting.key) && seoDefaults[setting.key] === null) {
        seoDefaults[setting.key] = setting.value
      }
    })

    data.description = seoDefaults.SEO_DESCRIPTION
    data.event_title = seoDefaults.EVENT_TITLE
    data.title = seoDefaults.EVENT_TITLE

    console.log('template-data: %j', data)
    return RenderHelper.renderTemplate('public.seo', data)
  }).then(html => {
    return s3.putObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, 'seo/event.html', html, null, 'text/html')
  }).catch(err => {
    logger.log('Error!', err)
    callback()
  }).finally(function () {
    callback()
  })
}
