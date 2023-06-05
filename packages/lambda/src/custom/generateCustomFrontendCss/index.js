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
const HttpException = require('./../../exceptions/http')
const ResourceNotFoundException = require('./../../exceptions/resourceNotFound')
const S3 = require('./../../aws/s3')
const SettingsRepository = require('./../../repositories/settings')
const Request = require('./../../aws/request')
const SettingHelper = require('./../../helpers/setting')
const RenderHelper = require('./../../helpers/render')

exports.handle = function (event, context, callback) {
  logger.log('generateCustomFrontendCss event: %j', event)

  const request = new Request(event, context)
  const repository = new SettingsRepository()

  request.validate().then(function () {
    return repository.get(SettingHelper.SETTING_ACCENT_COLOR)
  }).then(function (setting) {
    return generateCssBody(setting.value)
  }).then(function (response) {
    return writeCssFile(response)
  }).then(function () {
    callback()
  }).catch(function (err) {
    if (err instanceof ResourceNotFoundException) {
      // write empty file
      return writeCssFile('').then(function () {
        callback()
      }).catch(function (err) {
        throw err
      })
    } else {
      throw err
    }
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })

  /**
   * Generate custom css body
   *
   * @param {String} color
   * @returns {String}
   */
  const generateCssBody = function (color) {
    return RenderHelper.renderTemplate('css/custom', {
      color: color
    })
  }

  /**
   * Write custom css file to s3
   *
   * @param {String} body
   * @returns {Promise}
   */
  const writeCssFile = function (body) {
    const s3 = new S3()
    const region = process.env.AWS_REGION
    const bucket = process.env.PUBLIC_PAGES_S3_BUCKET
// todo
    return s3.putObject(region, bucket, 'assets/css/custom.css', body)
  }
}
