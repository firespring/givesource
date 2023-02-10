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

const FilesRepository = require('./../../repositories/files')
const logger = require('./../../helpers/log')
const querystring = require('querystring')
const RenderHelper = require('./../../helpers/render')
const SettingsRepository = require('./../../repositories/settings')

exports.handle = function (event, context, callback) {
  logger.log('cognitoCustomMessage event: %j', event)

  const filesRepository = new FilesRepository()
  const settingsRepository = new SettingsRepository()

  const settings = {
    ADMIN_PAGES_CLOUD_FRONT_URL: process.env.ADMIN_PAGES_CLOUD_FRONT_URL,
    CONTACT_PHONE: null,
    EMAILS_USER_REGISTRATION_ACTIVATED: null,
    EVENT_LOGO: null,
    EVENT_TITLE: null,
    EVENT_URL: process.env.EVENT_URL,
    UPLOADS_CLOUD_FRONT_URL: process.env.UPLOADS_CLOUD_FRONT_URL
  }

  let promise = Promise.resolve()
  if (event.triggerSource === 'CustomMessage_AdminCreateUser' || event.triggerSource === 'CustomMessage_ForgotPassword') {
    promise = promise.then(function () {
      return settingsRepository.batchGet(Object.keys(settings)).then(function (response) {
        response.forEach(function (setting) {
          settings[setting.key] = setting.value
        })
      }).then(function () {
        if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
          return filesRepository.get(settings.EVENT_LOGO)
        } else {
          return Promise.resolve(null)
        }
      }).then(function (response) {
        if (response) {
          settings.EVENT_LOGO = settings.UPLOADS_CLOUD_FRONT_URL + '/' + response.path
        }
      })
    })
  }

  if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
    promise = promise.then(function () {
      return RenderHelper.renderTemplate('emails.registration-verify', {
        settings: settings,
        verificationUrl: settings.ADMIN_PAGES_CLOUD_FRONT_URL + '/login?id=' + event.request.usernameParameter + '&token=' + event.request.codeParameter
      }).then(function (response) {
        event.response.emailSubject = `${settings.EVENT_TITLE} - Verify your email address`
        event.response.emailMessage = response
      })
    })
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    promise = promise.then(function () {
      return RenderHelper.renderTemplate('emails.forgot-password', {
        settings: settings,
        resetPasswordUrl: settings.ADMIN_PAGES_CLOUD_FRONT_URL + '/forgot-password/reset?' + querystring.stringify({ email: event.request.userAttributes.email }) + '&code=' + event.request.codeParameter
      }).then(function (response) {
        event.response.emailSubject = `${settings.EVENT_TITLE} - Your password reset request`
        event.response.emailMessage = response
      })
    })
  }

  promise.then(function () {
    callback(null, event)
  }).catch(function (err) {
    callback(err)
  })
}
