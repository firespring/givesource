/*
 * Copyright 2018 Firespring, Inc.
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

const _ = require('lodash');
const Donation = require('./../../models/donation');
const DonationHelper = require('./../../helpers/donation');
const DonationsRepository = require('./../../repositories/donations');
const File = require('./../../models/file');
const FilesRepository = require('./../../repositories/files');
const json2csv = require('json2csv');
const NonprofitDonationsRepository = require('./../../repositories/nonprofitDonations');
const QueryBuilder = require('./../../aws/queryBuilder');
const Report = require('./../../models/report');
const ReportHelper = require('./../../helpers/report');
const ReportsRepository = require('./../../repositories/reports');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');
const SettingHelper = require('./../../helpers/setting');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const filesRepository = new FilesRepository();
	const reportsRepository = new ReportsRepository();
	const request = new Request(event, context);
	const s3 = new S3();
	const settingsRepository = new SettingsRepository();

	let timezone = 'UTC';
	const report = new Report(request._body);
	const file = new File();
	const filename = request.get('name', 'report') + '-' + getFilenameTimestamp() + '.csv';
	request.validate().then(function () {
		file.populate({
			filename: filename.toLowerCase(),
			path: 'reports/' + file.uuid,
		});
		return file.validate();
	}).then(function () {
		return settingsRepository.get(SettingHelper.SETTING_EVENT_TIMEZONE).then(function (response) {
			if (response && response.hasOwnProperty('value')) {
				timezone = response.value;
			}
		}).catch(function () {
			return Promise.resolve();
		});
	}).then(function () {
		if (report.status === ReportHelper.STATUS_PENDING) {
			switch (report.type) {
				case ReportHelper.TYPE_DONATIONS:
					return getDonationsData(report, timezone);

				default:
					return Promise.resolve();
			}
		}
	}).then(function (response) {
		if (response) {
			const csv = json2csv({data: response.data, fields: response.fields});
			return s3.putObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, `reports/${file.uuid}`, csv, 'text/csv', `attachment; filename=${file.filename}`).then(function () {
				return filesRepository.save(file);
			}).then(function () {
				report.populate({
					fileUuid: file.uuid,
					status: ReportHelper.STATUS_SUCCESS,
				});
				return reportsRepository.save(report);
			});
		} else {
			return report.populate({status: ReportHelper.STATUS_FAILED});
		}
	}).then(function () {
		callback();
	}).catch(function (err) {
		console.log('error: %j', err);
		callback();
	});
};

/**
 * Get a timestamp formatted for a filename
 *
 * @return {string}
 */
const getFilenameTimestamp = function () {
	const date = new Date();
	return date.toLocaleDateString().replace(/[\/ ]+/g, '-') + '-' + date.toLocaleTimeString().replace(/[: ]+/g, '-');
};

/**
 * Get donation data
 *
 * @param {Report} report
 * @param {String} timezone
 * @return {Promise}
 */
const getDonationsData = function (report, timezone) {
	const builder = new QueryBuilder('query');
	const donationsRepository = new DonationsRepository();
	const nonprofitDonationsRepository = new NonprofitDonationsRepository();
	const settingsRepository = new SettingsRepository();

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

	if (report.nonprofitUuid) {
		promise = promise.then(function () {
			builder.limit(1000).index('nonprofitUuidCreatedOnIndex').condition('nonprofitUuid', '=', report.nonprofitUuid).condition('createdOn', '>', 0).scanIndexForward(true);
			return nonprofitDonationsRepository.batchQuery(builder);
		});
	} else {
		promise = promise.then(function () {
			return donationsRepository.batchScan();
		});
	}

	promise = promise.then(function (response) {
		const items = response.hasOwnProperty('Items') ? response.Items : [];
		let donations = items.map(function (donation) {
			return new Donation(donation);
		});
		donations.sort(function (a, b) {
			return  b.createdOn - a.createdOn;
		});
		if (!displayTestPayments) {
			donations = donations.filter(function (donation) {
				return !donation.paymentTransactionIsTestMode;
			});
		}
		return Promise.resolve({
			data: donations.map(function (donation) {
				const data = donation.mutate(null, {timezone: timezone});
				data.donorFirstName = data.isAnonymous ? 'Anonymous' : data.donorFirstName;
				return data;
			}),
			fields: DonationHelper.reportFields,
		});
	}).catch(function (err) {
		console.log(err);
	});

	return promise;
};