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
const SES = require('./../aws/ses')
const SettingsRepository = require('./../repositories/settings')

/**
 * Get contact email addresses and their verification status
 */
exports.getContactEmailAddresses = function () {
  const repository = new SettingsRepository()
  const ses = new SES()

  let from = null; let to = null
  return repository.batchGet(['CONTACT_EMAIL', 'SENDER_EMAIL']).then(function (settings) {
    if (settings.length) {
      to = _getSettingValue(settings, 'CONTACT_EMAIL')
      from = _getSettingValue(settings, 'SENDER_EMAIL')
    }
    return ses.listIdentities()
  }).then(function (response) {
    const identities = response.hasOwnProperty('Identities') ? response.Identities : []
    if (identities.length) {
      return ses.getIdentityVerificationAttributes(identities)
    } else {
      return Promise.resolve([])
    }
  }).then(function (response) {
    const results = []
    if (response.hasOwnProperty('VerificationAttributes')) {
      Object.keys(response.VerificationAttributes).forEach(function (key) {
        results.push({
          email: key,
          verified: response.VerificationAttributes[key].VerificationStatus === 'Success'
        })
      })
    }
    const addresses = {
      to: _.find(results, { email: to }),
      from: _.find(results, { email: from })
    }
    return Promise.resolve(addresses)
  })
}

/**
 * Get a setting's value from a collection of settings
 *
 * @param {[]} settings
 * @param {String} key
 * @return {null}
 * @private
 */
const _getSettingValue = function (settings, key) {
  let result = null
  if (settings.length) {
    result = _.find(settings, { key: key })
  }
  return result ? result.value : null
}
