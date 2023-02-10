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

const EmailHelper = require('./../../helpers/email')
const HttpException = require('./../../exceptions/http')
const Lambda = require('./../../aws/lambda')
const Request = require('./../../aws/request')
const SES = require('./../../aws/ses')
const SettingsRepostiory = require('./../../repositories/settings')
const DonationsRepostiory = require('./../../repositories/donations')

exports.handle = (event, context, callback) => {
  const lambda = new Lambda()
  const request = new Request(event, context)
  const ses = new SES()
  const settingsRepository = new SettingsRepostiory()
  const donationsRepository = new DonationsRepostiory()

  let html = null
  const donor = request.get('donor', null)
  const email = request.get('email', null)
  const settings = { EVENT_TITLE: null }
  const toAddress = request.get('toAddress', null)
  const body = {
    email: email,
    donor: donor,
    donations: request.get('donations', []),
    paymentTransaction: request.get('paymentTransaction', null)
  }
  request.validate().then(() => {
    if (request.get('donationIds', false)) {
      return donationsRepository.queryDonations({ where: { id: request.get('donationIds', []) } })
    }
    return Promise.resolve()
  }).then(response => {
    if (response && response.hasOwnProperty('rows')) {
      body.donations = response.rows.map(donation => {
        donation.timezone = settings.EVENT_TIMEZONE
        donation.total = donation.formattedAmount
        donation.isFeeCovered = (donation.isFeeCovered === 'Yes' || donation.isFeeCovered === true)
        donation.isOfflineDonation = (donation.isOfflineDonation === 'Yes' || donation.isOfflineDonation === true)
        return donation
      })
    }
    return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-GenerateDonationsReceipt', { body: body }, 'RequestResponse')
  }).then(response => {
    const payload = JSON.parse(response.Payload)
    if (payload.html) {
      html = payload.html
      return settingsRepository.batchGet(Object.keys(settings))
    } else {
      return Promise.reject(new Error('Unable to generate a receipt'))
    }
  }).then(response => {
    response.forEach(setting => {
      settings[setting.key] = setting.value
    })

    return EmailHelper.getContactEmailAddresses()
  }).then(response => {
    if (response.from.email && response.from.verified) {
      let toAddresses = donor && donor.email ? [donor.email] : [email]
      toAddresses = toAddress ? [toAddress] : toAddresses
      const subject = settings.EVENT_TITLE ? 'Tax receipt: Thank you for participating in ' + settings.EVENT_TITLE : 'Tax receipt: Thank you for giving'
      return ses.sendEmail(subject, html, null, response.from.email, toAddresses)
    } else {
      return Promise.reject(new Error('from contact email address missing or not verified'))
    }
  }).then(() => {
    callback()
  }).catch((err) => {
    console.log('Error: %j', err);
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
