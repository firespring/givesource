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

require('./config/bootstrap').bootstrap()

const inquirer = require('inquirer')
const DonationsRepository = require('../src/repositories/donations')
const PaymentTransactionRepository = require('../src/repositories/paymentTransactions')
const loadModels = require('../src/models/index')
const Sequelize = require('sequelize')

const deletePaymentsByTransactionIds = function () {
  const paymentTransactionRepository = new PaymentTransactionRepository()
  const donationsRepository = new DonationsRepository()

  inquirer.prompt([
    {
      type: 'input',
      message: 'Input the payment transaction ids list to clean up from database. Example (pt1,pt2,pt3,exc):',
      name: 'paymentTransactionIds',
      default: ''
    }
  ]).then(answers => {
    const answerString = answers.paymentTransactionIds
    const answerStringNoWhiteSpace = answerString.replace(/\s+/g, '')
    return queryPaymentTransactions(answerStringNoWhiteSpace.split(','))
  }).then(paymentTransactions => {
    return Promise.all(paymentTransactions.map(function (paymentTransaction) {
      // Delete the pt and go through and delete each donation
      return paymentTransactionRepository.delete(paymentTransaction.id).then(function () {
        console.log(`Payment Transaction: ${paymentTransaction.transactionId} was DELETED.`)
        return Promise.all(paymentTransaction.Donations.map(function (donation) {
          console.log(`${paymentTransaction.transactionId} --- DELETED: Donation ID: (${donation.id}) for Nonprofit: ${donation.Nonprofit.legalName}`)
          return donationsRepository.delete(donation.id)
        }))
      })
    }))
  }).then(function () {
    console.log('done.')
  }).catch(function (err) {
    console.log(`error: ${err}`)
  })
}

/**
 * Get paymentTransactions data
 *
 * @return {Promise}
 */
const queryPaymentTransactions = function (paymentTransactionIds) {
  const paymentTransactionRepository = new PaymentTransactionRepository()

  let allModels
  return loadModels().then(function (models) {
    allModels = models

    const params = {
      include: [
        {
          model: allModels.Donation,
          include: [
            { model: allModels.Nonprofit }
          ],
          required: true
        }
      ],
      where: {
        transactionId: {
          [Sequelize.Op.or]: paymentTransactionIds
        }
      }
    }
    return paymentTransactionRepository.getAll(params)
  }).catch(function (err) {
    console.log(err)
  })
}

deletePaymentsByTransactionIds()
