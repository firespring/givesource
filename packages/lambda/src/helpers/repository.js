/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const stackName = process.env.AWS_STACK_NAME;

exports.DonationsTable = `${stackName}-Donations`;
exports.DonorsTable = `${stackName}-Donors`;
exports.FilesTable = `${stackName}-Files`;
exports.MessagesTable = `${stackName}-Messages`;
exports.MetricsTable = `${stackName}-Metrics`;
exports.NonprofitsTable = `${stackName}-Nonprofits`;
exports.NonprofitDonationTiersTable = `${stackName}-NonprofitDonationTiers`;
exports.NonprofitSlidesTable = `${stackName}-NonprofitSlides`;
exports.PagesTable = `${stackName}-Pages`;
exports.PageContentsTable = `${stackName}-PageContents`;
exports.PaymentTransactionsTable = `${stackName}-PaymentTransactions`;
exports.ReportsTable = `${stackName}-Reports`;
exports.SettingsTable = `${stackName}-Settings`;
exports.SponsorsTable = `${stackName}-Sponsors`;
exports.SponsorTiersTable = `${stackName}-SponsorTiers`;
exports.UsersTable = `${stackName}-Users`;