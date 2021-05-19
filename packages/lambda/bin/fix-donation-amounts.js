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

const config = require('config');
const DonationHelper = require('./../src/helpers/donation');
const DonationsRepository = require('./../src/repositories/donations');
const PaymentTransactionRepository = require('./../src/repositories/paymentTransactions');
const SettingHelper = require('./../src/helpers/setting');
const SettingsRepository = require('./../src/repositories/settings');
const loadModels = require('./../src/models/index');
const Sequelize = require('sequelize');

const fixDonations = function() {
    const settingsRepository = new SettingsRepository();

    let numChanged = 0;
    let transactionFlatFee = 0;
    let transactionPercentFee = 0;

    settingsRepository.get(SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE).then(function(flatFee) {
        transactionFlatFee = flatFee.value;
        return settingsRepository.get(SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE);
    }).then(function (feePercentage) {
        transactionPercentFee = feePercentage.value;
//        return getDonationsData();
//    }).then(function (donations) {
        return queryPaymentTransactions();
    }).then(function (paymentTransactions) {
        paymentTransactions.forEach(function (paymentTransaction) {
            let subtotal = 0;
            let fees = 0;
            paymentTransaction.Donations.forEach(function (donation) {
                donation.fees = DonationHelper.calculateFees(
                    donation.isOfflineDonation,
                    donation.isFeeCovered,
                    donation.subtotal,
                    transactionFlatFee,
                    transactionPercentFee
                );

                //
                donation.total = donation.amountForNonprofit + donation.fees;

                subtotal += donation.subtotal;

                // TODO if fee is not covered we need to change the amount for nonprofit???
                if (donation.isFeeCovered) {
                    fees += donation.fees;
                }

                //donation.paymentTransaction.transactionAmount = donation.total;

                if (donation.changed())
                {
                    numChanged += 1;
                    showChanges(donation);
                    // TODO: Update
                }
            });

            paymentTransaction.transactionAmount = subtotal + fees;
            if (paymentTransaction.changed())
            {
                showChanges(paymentTransaction);
            }
            foo.bar;
            // Only update if the values have changed
            if (donation.changed())
            {
                numChanged += 1;
                showChanges(donation);
                // TODO: Update
            }
        });
        //console.log(`CHANGED ${numChanged} rows`);











//    }).then(() => {
//        const body = {
//            donations: donations.map((donation) => {
//                donation.timezone = settings.EVENT_TIMEZONE;
//                donation.total = donation.formattedAmount;
//                return donation;
//            }),
//            donor: donor,
//            paymentTransaction: paymentTransaction,
//        };
//        // there was a mutate function looking like to fix the timezones
//        lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationsReceiptEmail', {body: body});
//    }).then(() => {
//        const body = {
//            donations: donations.map((donation) => {
//                donation.timezone = settings.EVENT_TIMEZONE;
//        donation.subtotal = donation.formattedSubtotal;
//                return donation;
//            }),
//      donor: donor
//        };
//        lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationNotificationEmail', {body: body});
//        callback();
    }).catch(function (err) {
        console.log(`error: ${err}`);
    });
};

/**
 * Get paymentTransactions data
 *
 * @return {Promise}
 */
const queryPaymentTransactions = function () {
    const paymentTransactionRepository = new PaymentTransactionRepository();

    let allModels;
    return loadModels().then(function (models) {
        allModels = models;

//            include: [
//                {model: allModels.PaymentTransaction},
//                {model: allModels.Donations}
//            ],
        const params = {
            include: [{model: allModels.Donation}],
            where: {
                IsTestMode: 0,
                createdAt: {[Sequelize.Op.lt]: new Date('2021-05-12')}
            }
        };
        return paymentTransactionRepository.getAll(params);
    }).catch(function (err) {
        console.log(err);
    });


    return promise;
};

const showChanges = function (thing) {
    let message = `${thing} (Id: ${thing.id})`;
    console.log(message);
    thing.changed().forEach(function (columnName) {
        message += ` ${columnName}: ${thing._previousDataValues[columnName]} => ${thing.dataValues[columnName]},`;
    });
    console.log(message);
};

fixDonations();
