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

const stackName = process.env.AWS_STACK_NAME

exports.AgreementsTable = `${stackName}-Agreements`
exports.ContentsTable = `${stackName}-Contents`
exports.DonationsTable = `${stackName}-Donations`
exports.DonorsTable = `${stackName}-Donors`
exports.FilesTable = `${stackName}-Files`
exports.MessagesTable = `${stackName}-Messages`
exports.MetricsTable = `${stackName}-Metrics`
exports.NonprofitsTable = `${stackName}-Nonprofits`
exports.NonprofitDonationTiersTable = `${stackName}-NonprofitDonationTiers`
exports.NonprofitSlidesTable = `${stackName}-NonprofitSlides`
exports.PaymentTransactionsTable = `${stackName}-PaymentTransactions`
exports.ReportsTable = `${stackName}-Reports`
exports.SettingsTable = `${stackName}-Settings`
exports.SponsorsTable = `${stackName}-Sponsors`
exports.SponsorTiersTable = `${stackName}-SponsorTiers`
exports.UsersTable = `${stackName}-Users`
