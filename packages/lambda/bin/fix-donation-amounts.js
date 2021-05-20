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
const Lambda = require('./../src/aws/lambda');
const Sequelize = require('sequelize');

const fixDonations = function() {
    const settingsRepository = new SettingsRepository();
    const lambda = new Lambda();

    let numChanged = 0;
    let numTotal = 0;
    let transactionFlatFee = 0;
    let transactionPercentFee = 0;
    let eventTimezone = null;

    settingsRepository.get(SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE).then(function(flatFee) {
        transactionFlatFee = parseInt(flatFee.value);
        console.log(`Transaction flat fee is ${transactionFlatFee}`);
        return settingsRepository.get(SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE);
    }).then(function (feePercentage) {
        transactionPercentFee = parseFloat(feePercentage.value);
        console.log(`Transaction percent fee is ${transactionPercentFee}`);
        return settingsRepository.get(SettingHelper.SETTING_EVENT_TIMEZONE);
    }).then(function (timezone) {
        eventTimezone = timezone.value;
        console.log(`Event Timezone is ${eventTimezone}`);
        return queryPaymentTransactions();
    }).then(function (paymentTransactions) {
        paymentTransactions.forEach(function (paymentTransaction) {
            let subtotal = 0;
            let fees = 0;
            let donationsToSendReceiptsFor = [];
            paymentTransaction.Donations.forEach(function (donation) {
                numTotal += 1;

                //re-calculate the fees based off the current settings
                donation.fees = DonationHelper.calculateFees(
                    donation.isOfflineDonation,
                    donation.isFeeCovered,
                    donation.subtotal,
                    transactionFlatFee,
                    transactionPercentFee
                );

                subtotal += donation.subtotal;
                if (donation.isFeeCovered) {
                    // If the fees were covered by the user we decrease the total amount by however much less the fees are
                    donation.total = donation.amountForNonprofit + donation.fees;
                    if (!donation.isOfflineDonation) {
                        donation.subtotalChargedToCard = donation.total
                    }
                    fees += donation.fees;
                }
                else
                {
                    // If the fees were not covered we increase the amount going to the nonprofit
                    donation.amountForNonprofit = donation.total - donation.fees;
                }
            });

            // Update teh total transaction amount for the paymentTransaction based of
            // the updated values from all of the donations
            paymentTransaction.transactionAmount = subtotal + fees;

            // Print any changes that were made
            if (paymentTransaction.changed())
            {
                showChanges(paymentTransaction);
            }
            paymentTransaction.Donations.forEach(function (donation) {
                if (donation.changed())
                {
                    numChanged += 1;
                    showChanges(donation);
                    if (donation.isFeeCovered) {
                        donationsToSendReceiptsFor.push(donation);
                    }
                }
            });
            // TODO: Save the PaymentTransaction and ALL Donations

            if (donationsToSendReceiptsFor.length)
            {
                paymentTransaction.timezone = eventTimezone;
                const body = {
                    donations: donationsToSendReceiptsFor.map((donation) => {
                        donation.timezone = eventTimezone;
                        donation.total = donation.formattedAmount;
                        return donation;
                    }),
                    donor: donationsToSendReceiptsFor[0].Donor,
                    paymentTransaction: paymentTransaction,
                };
                //lambda.invoke(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME') + '-SendDonationsReceiptEmail', {body: body});
            }
        });
        console.log(`CHANGED ${numChanged} of ${numTotal} donations`);
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

        const params = {
            include: [
                {
                    model: allModels.Donation,
                    include: [
                        {model: allModels.Donor},
                        {model: allModels.Nonprofit}
                    ]
                }
            ],
            where: {
                id: 1,
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
    let message = `${thing} (Id: ${thing.id}),`;
    thing.changed().forEach(function (columnName) {
        message += ` ${columnName}: ${thing._previousDataValues[columnName]} => ${thing.dataValues[columnName]},`;
    });
    console.log(message);
};

fixDonations();
