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

require('./config/bootstrap').bootstrap();

const inquirer = require('inquirer');
const config = require('config');
const DonationHelper = require('./../src/helpers/donation');
const DonationsRepository = require('./../src/repositories/donations');
const PaymentTransactionRepository = require('./../src/repositories/paymentTransactions');
const SettingHelper = require('./../src/helpers/setting');
const SettingsRepository = require('./../src/repositories/settings');
const loadModels = require('./../src/models/index');
const Lambda = require('./../src/aws/lambda');
const Sequelize = require('sequelize');

const deletePaymentsByTransactionIds = function () {
  const paymentTransactionRepository = new PaymentTransactionRepository();
  const donationsRepository = new DonationsRepository();

  let numChanged = 0;

  inquirer.prompt([
    {
      type: 'input',
      message: 'Input the payment transaction ids list to clean up from database. Example (pt1,pt2,pt3,exc):',
      name: 'paymentTransactionIds',
      default: 'a4159a7b56cf4fa59f59e8bbcb30a5f7,83e80984daf749af9bc9816a3b7781f8,2bbfd60f736044dd8202cef63312b6d6'
    }
  ]).then(answers => {
    let answerString = answers.paymentTransactionIds;
    let answerStringNoWhiteSpace = answerString.replace(/\s+/g, '')
    return queryPaymentTransactions(answerStringNoWhiteSpace.split(','));
  }).then(paymentTransactions => {
    return Promise.all(paymentTransactions.map(function (paymentTransaction) {
      updateFees(paymentTransaction);

      // Print any changes that were made
      if (paymentTransaction.changed())
      {
        showChanges(paymentTransaction);
      }

      // Print any changes that were made, flag any donations where the fees were covered for a receipt
      paymentTransaction.Donations.forEach(function (donation) {
        if (donation.changed())
        {
          numChanged += 1;
          showChanges(donation);
        }
      });

      // Save the data and send updated receipts
      return paymentTransactionRepository.save(paymentTransaction).then(function () {
        return Promise.all(paymentTransaction.Donations.map(function (donation) {
          return donationsRepository.save(donation);
        }));
      });
    }));
  }).then(function () {
    console.log(`CHANGED ${numChanged} donations`);
  }).catch(function (err) {
    console.log(`error: ${err}`);
  });
}


/**
 * Get paymentTransactions data
 *
 * @return {Promise}
 */
const queryPaymentTransactions = function (paymentTransactionIds) {
  const paymentTransactionRepository = new PaymentTransactionRepository();

  let allModels;
  return loadModels().then(function (models) {
    allModels = models;

    const params = {
      include: [
        {
          model: allModels.Donation,
          include: [
            {model: allModels.Donor},
          ],
          required: true
        }
      ],
      where: {
        transactionId: {
          [Sequelize.Op.or]: paymentTransactionIds
        }
      }
    };
    return paymentTransactionRepository.getAll(params);
  }).catch(function (err) {
    console.log(err);
  });
};

const updateFees = function(paymentTransaction) {
  paymentTransaction.Donations.forEach(function (donation) {
    donation.total = 0;
    donation.subtotalChargedToCard = 0;
    donation.subtotal = 0;
    donation.amountForNonprofit = 0;
  });

  // Update payment transaction status to REFUNDED and set total to 0
  paymentTransaction.transactionAmount = 0;
  paymentTransaction.transactionStatus = 'REFUNDED';
};

const showChanges = function (thing) {
  let message = `${thing} (Id: ${thing.id}),`;
  thing.changed().forEach(function (columnName) {
    message += ` ${columnName}: ${thing._previousDataValues[columnName]} => ${thing.dataValues[columnName]},`;
  });
  console.log(message);
};

deletePaymentsByTransactionIds();