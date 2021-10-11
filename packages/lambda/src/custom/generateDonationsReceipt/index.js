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
const DonationsRepository = require('./../../repositories/donations')
const DonorsRepository = require('./../../repositories/donors')
const FilesRepository = require('./../../repositories/files')
const HttpException = require('./../../exceptions/http')
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions')
const RenderHelper = require('./../../helpers/render')
const Request = require('./../../aws/request')
const SettingsRepository = require('./../../repositories/settings')

exports.handle = (event, context, callback) => {
  const donationsRepository = new DonationsRepository()
  const donorsRepository = new DonorsRepository()
  const filesRepository = new FilesRepository()
  const paymentTransactionsRepository = new PaymentTransactionsRepository()
  const request = new Request(event, context)
  const settingsRepository = new SettingsRepository()

  let donor = request.get('donor', null)
  let donations = request.get('donations', [])
  let paymentTransaction = request.get('paymentTransaction', null)
  let transactions = []

  let settings = {
    CONTACT_PHONE: null,
    EMAILS_DONATION_RECEIPT_AFTER_LIST: null,
    EMAILS_DONATION_RECEIPT_BEFORE_LIST: null,
    EVENT_URL: null,
    EVENT_TIMEZONE: null,
    EVENT_TITLE: null,
    EVENT_LOGO: null,
    PAGE_TERMS_ENABLED: null,
    UPLOADS_CLOUD_FRONT_URL: null
  }
  request.validate().then(() => {
    return settingsRepository.batchGet(Object.keys(settings))
  }).then(response => {
    response.forEach(setting => {
      settings[setting.key] = setting.value
    })

    if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
      return filesRepository.get(settings.EVENT_LOGO)
    } else {
      return Promise.resolve(null)
    }
  }).then(response => {
    if (response) {
      settings.EVENT_LOGO = settings.UPLOADS_CLOUD_FRONT_URL + '/' + response.path
    }

    if (donor) {
      return Promise.resolve()
    } else if (request.get('email', false)) {
      return donorsRepository.queryEmail(request.get('email'))
    } else {
      return Promise.reject(new Error('donor or email address missing'))
    }
  }).then(response => {
    if (response) {
      donor = response
      donor.timezone = settings.EVENT_TIMEZONE
    }

    if (donor && donations.length === 0) {
      const params = {}
      params.where = { donorId: donor.id }
      return donationsRepository.queryDonations(params)
    }
    return Promise.resolve({})
  }).then(response => {
    if (response.hasOwnProperty('rows')) {
      donations = response.rows.map(donation => {
        donation.timezone = settings.EVENT_TIMEZONE
        donation.total = donation.formattedAmount
        donation.isFeeCovered = (donation.isFeeCovered === 'Yes' || donation.isFeeCovered === true)
        donation.isOfflineDonation = (donation.isOfflineDonation === 'Yes' || donation.isOfflineDonation === true)
        return donation
      })
    }
    let promise = Promise.resolve()
    if (paymentTransaction && donations.length) {
      donations = donations.map(donation => {
        donation.timezone = settings.EVENT_TIMEZONE
        donation.isFeeCovered = (donation.isFeeCovered === 'Yes' || donation.isFeeCovered === true)
        donation.isOfflineDonation = (donation.isOfflineDonation === 'Yes' || donation.isOfflineDonation === true)
        return donation
      })

      const transaction = paymentTransaction
      transaction.transactionAmount = transaction.formattedAmount
      transaction.Donations = donations
      transaction.isAnonymous = (transaction.Donations && transaction.Donations.length) ? transaction.Donations[0].isAnonymous : false
      transaction.isFeeCovered = (transaction.Donations && transaction.Donations.length) ? transaction.Donations[0].isFeeCovered : false
      transactions.push(transaction)
    } else {
      const paymentTransactionIds = donations.map(donation => {
        return donation.paymentTransactionId || null
      }).filter((id, index, ids) => {
        return id !== null && index === ids.indexOf(id)
      })

      paymentTransactionIds.forEach(id => {
        promise = promise.then(() => {
          return paymentTransactionsRepository.get(id)
        }).then(paymentTransaction => {
          const transaction = paymentTransaction
          transaction.timezone = settings.EVENT_TIMEZONE
          transaction.transactionAmount = transaction.formattedAmount
          transaction.isAnonymous = (transaction.Donations && transaction.Donations.length) ? transaction.Donations[0].isAnonymous : false
          transaction.isFeeCovered = (transaction.Donations && transaction.Donations.length) ? transaction.Donations[0].isFeeCovered : false
          if (transaction.Donations) {
            transaction.Donations.forEach(function (donation) {
              donation.total = donation.formattedAmount
            })
          }
          transactions.push(transaction)
        }).catch(() => {
          // Ignore missing transactions (no transactions are created in test mode)
        })
      })
    }
    if (!transactions.length && donations.length) {
      console.log('here?', donations) // DM: DEBUG
      let promise = Promise.resolve()
      donations.forEach(donation => {
        let transaction
        promise = promise.then(function () {
          console.log('get ready to pop') // DM: DEBUG
          return paymentTransactionsRepository.populate({ createdAt: donation.createdAt })
        }).then(function (popTransaction) {
          console.log('popTransaction', popTransaction) // DM: DEBUG
          transaction = popTransaction
          transaction.timezone = settings.EVENT_TIMEZONE
          transaction.transactionAmount = transaction.formattedAmount
          transaction.Donations = [donation]
          transaction.isAnonymous = donation.isAnonymous
          transaction.isFeeCovered = donation.isFeeCovered
          transactions.push(transaction)
          console.log('make it!') // DM: DEBUG
        }).catch(function (err) {
          console.log('error?', err) // DM: DEBUG
        })
      })
    }

    console.log('!transactions.length', transactions.length) // DM: DEBUG

    return promise.then(() => {
      if (!transactions.length) {
        return Promise.reject(new Error('No donations were found'))
      }
      return promise
    })
  }).then(() => {
    return RenderHelper.renderTemplate('emails.donation-receipt', {
      donor: donor,
      settings: settings,
      transactions: transactions
    })
  }).then(response => {
    callback(null, {
      html: response
    })
  }).catch(err => {
    console.log('Error: %j', err);
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}