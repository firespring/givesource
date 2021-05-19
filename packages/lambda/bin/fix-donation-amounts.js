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
const SettingHelper = require('./../src/helpers/setting');
const SettingsRepository = require('./../src/repositories/settings');
const loadModels = require('./../src/models/index');
const Sequelize = require('sequelize');

const fixDonations = function() {
    const settingsRepository = new SettingsRepository();

    let numChanged = 0;
    let settings = {};
    settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE] = null;
    settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE] = null;

    settingsRepository.batchGet(Object.keys(settings)).then((response) => {
        response.forEach((setting) => {
            settings[setting.key] = setting.value;
        });
    }).then(function () {
        return getDonationsData();
    }).then(function (donations) {
        let transactionFlatFee = settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE];
        transactionFlatFee = transactionFlatFee ? parseInt(transactionFlatFee) : 0;

        let transactionPercentFee = settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE];
        transactionPercentFee = transactionPercentFee ? parseFloat(transactionPercentFee) : 0;

        donations.rows.forEach(function (donation) {
            donation.fees = DonationHelper.calculateFees(
                donation.isOfflineDonation,
                donation.isFeeCovered,
                donation.subtotal,
                transactionFlatFee,
                transactionPercentFee
            );
            donation.total = donation.amountForNonprofit + donation.fees;
            console.log(donation);
            donation.paymentTransaction.transactionAmount = donation.total;

            // Only update if the values have changed
            if (donation.changed())
            {
                numChanged += 1;
                showChanges(donation);
                // TODO: Update
            }
        });
        console.log(`CHANGED ${numChanged} rows`);

    }).catch(function (err) {
        console.log(`error: ${err}`);
    });
};

/**
 * Get donation data
 *
 * @return {Promise}
 */
const getDonationsData = function () {
    const donationsRepository = new DonationsRepository();
    const settingsRepository = new SettingsRepository();

    let allModels;
    return loadModels().then(function (models) {
        allModels = models;

        const params = {
            include: [
                {model: allModels.PaymentTransactions},
                {model: allModels.Donor}
            ],
            where: {
                paymentTransactionIsTestMode: 0,
                isFeeCovered: 1,
                isDeleted: 0,
                createdAt: {[Sequelize.Op.lt]: new Date('2021-05-12')}
            }
        };
        return donationsRepository.queryDonations(params);
    }).catch(function (err) {
        console.log(err);
    });


    return promise;
};

const showChanges = function (donation) {
    let message = `Donation (Id: ${donation.id})`;
    donation.changed().forEach(function (columnName) {
        message += ` ${columnName}: ${donation._previousDataValues[columnName]} => ${donation.dataValues[columnName]},`;
    });
    console.log(message);
};

fixDonations();
