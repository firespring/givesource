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
const response = require('cfn-response')
const NonprofitsRepository = require('./../../repositories/nonprofits')
const SettingsRepository = require('./../../repositories/settings')
const FilesRepository = require('./../../repositories/files')
const SocialSharingHelper = require('./../../helpers/socialSharing')
const RenderHelper = require('./../../helpers/render')

exports.handle = function (event, context, callback) {
  const settingsRepository = new SettingsRepository()
  const nonprofitsRepository = new NonprofitsRepository()
  const filesRepository = new FilesRepository()
  const s3 = new S3()

  logger.log('warming social sharing cache event: %j', event)

  // Initial social sharing template (default)
  const settings = {
    EVENT_URL: null,
    UPLOADS_CLOUD_FRONT_URL: null,
    EVENT_LOGO: null,
    EVENT_TITLE: null,
    SOCIAL_SHARING_DESCRIPTION: null,
    SOCIAL_SHARING_IMAGE: null
  }

  const data = {
    description: null,
    event_title: null,
    image_url: null,
    title: null,
    url: null
  }

  const promise = Promise.resolve()
  promise.then(function () {
    return settingsRepository.batchGet(Object.keys(settings))
  }).then(response => {
    response.forEach(setting => {
      if (settings.hasOwnProperty(setting.key)) {
        settings[setting.key] = setting.value
      }
    })
  }).then(() => {
    // set sharing defaults
    data.description = SocialSharingHelper.SOCIAL_SHARING_DEFAULT_DESCRIPTION
    data.event_title = SocialSharingHelper.SOCIAL_SHARING_DEFAULT_TITLE
    data.title = SocialSharingHelper.SOCIAL_SHARING_DEFAULT_TITLE
    data.image_url = settings.EVENT_URL + '/' + SocialSharingHelper.SOCIAL_SHARING_DEFAULT_IMG

    console.log('template-data: %j', data)
    return RenderHelper.renderTemplate('public.social-sharing', data)
  }).then(html => {
    return s3.putObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, 'social-sharing/default.html', html, null, 'text/html')
  }).then(() => {
    return nonprofitsRepository.warmNonprofits()
  }).then(nonprofits => {
    let promise = Promise.resolve()
    nonprofits.forEach(nonprofit => {
      promise = promise.then(() => {
        data.description = nonprofit.socialSharingDescription ? nonprofit.socialSharingDescription : settings.SOCIAL_SHARING_DESCRIPTION ? settings.SOCIAL_SHARING_DESCRIPTION : SocialSharingHelper.SOCIAL_SHARING_DEFAULT_DESCRIPTION
        data.event_title = 'Support ' + nonprofit.legalName + 'at' + (settings.EVENT_TITLE) ? settings.EVENT_TITLE : SocialSharingHelper.SOCIAL_SHARING_DEFAULT_TITLE
        data.title = 'Support ' + nonprofit.legalName + 'at' + (settings.EVENT_TITLE) ? settings.EVENT_TITLE : SocialSharingHelper.SOCIAL_SHARING_DEFAULT_TITLE
        if (nonprofit.socialSharingFileId) {
          return filesRepository.get(nonprofit.socialSharingFileId)
        }

        if (settings.SOCIAL_SHARING_IMAGE) {
          return filesRepository.get(settings.SOCIAL_SHARING_IMAGE)
        }

        if (settings.EVENT_LOGO) {
          return filesRepository.get(settings.EVENT_LOGO)
        }

        return null
      }).then(file => {
        data.image_url = (file) ? settings.UPLOADS_CLOUD_FRONT_URL + '/' + file.path : settings.EVENT_URL + '/' + SocialSharingHelper.SOCIAL_SHARING_DEFAULT_IMG
        console.log('nonprofit template-data: %j', data)
        return RenderHelper.renderTemplate('public.social-sharing', data)
      }).then(html => {
        return s3.putObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, 'social-sharing/' + nonprofit.slug + '.html', html, null, 'text/html')
      })
    })
    return promise
  }).catch(err => {
    logger.log('Error!', err)
    response.send(event, context, response.FAILED)
    callback()
  }).finally(function () {
    response.send(event, context, response.SUCCESS)
    callback()
  })
}
