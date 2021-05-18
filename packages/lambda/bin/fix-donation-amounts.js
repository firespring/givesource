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
//const Lambda = require('./../src/aws/lambda');

//lambda.invoke(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME')

//const _ = require('lodash');
const DonationHelper = require('./../src/helpers/donation');
const DonationsRepository = require('./../src/repositories/donations');
const SettingHelper = require('./../src/helpers/setting');
const SettingsRepository = require('./../src/repositories/settings');

const fixDonations = function() {
//        process.env.AWS_DEFAULT_REGION = config.get('stack.AWS_REGION');
        const settingsRepository = new SettingsRepository();








        let settings = {};
        settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE] = null;
        settings[SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE] = null;

        settingsRepository.batchGet(Object.keys(settings)).then((response) => {
                response.forEach((setting) => {
                        settings[setting.key] = setting.value;
                });
                console.log(settings);
//      }).then(function () {
//              if (report.status === ReportHelper.STATUS_PENDING) {
//                      switch (report.type) {
//                              case ReportHelper.TYPE_DONATIONS:
//                                      return getDonationsData(report, timezone);
//
//                              default:
//                                      return Promise.resolve();
//                      }
//              }
        }).catch(function (err) {
                console.log('error: %j', err);
        });
};

/**
 * Get donation data
 *
 * @param {Report} report
 * @param {String} timezone
 * @return {Promise}
 */
const getDonationsData = function (report, timezone) {
        const donationsRepository = new DonationsRepository();
        const settingsRepository = new SettingsRepository();
        const whereParams = {isDeleted: 0};

        let displayTestPayments = false;
        let promise = Promise.resolve();
        promise = promise.then(function () {
                return settingsRepository.get(SettingHelper.SETTING_TEST_PAYMENTS_DISPLAY);
        }).then(function (response) {
                if (response && response.hasOwnProperty('value')) {
                        displayTestPayments = response.value;
                }
        }).catch(function () {
                return Promise.resolve();
        });

        // this needs commented out on dev
        if (!displayTestPayments) {
                whereParams.paymentTransactionIsTestMode = 0;
        }

        if (report.nonprofitId) {
                whereParams.nonprofitId = report.nonprofitId;
                promise = promise.then(function () {
                        return donationsRepository.generateReport(whereParams);
                });
        } else {
                promise = promise.then(function () {
                        return donationsRepository.generateReport(whereParams);
                });
        }

        promise = promise.then(function (donations) {
                return Promise.resolve({
                        data: donations.map(function (donation) {
                                donation.mutate = '';
                                donation.timezone = timezone;
                                if (donation.Donor && donation.isAnonymous) {
                                        donation.Donor.donorIsAnonymous = '';
                                }
                                return donation;
                        }),
                        fields: DonationHelper.reportFields,
                });
        }).catch(function (err) {
                console.log(err);
        });

        return promise;
};

fixDonations();
