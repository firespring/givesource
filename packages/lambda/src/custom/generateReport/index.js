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

const _ = require('lodash');
const DonationHelper = require('./../../helpers/donation');
const DonationsRepository = require('./../../repositories/donations');
const FilesRepository = require('./../../repositories/files');
const json2csv = require('json2csv');
const ReportHelper = require('./../../helpers/report');
const ReportsRepository = require('./../../repositories/reports');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');
const SettingHelper = require('./../../helpers/setting');
const SettingsRepository = require('./../../repositories/settings');
const UUID = require('node-uuid');

exports.handle = function (event, context, callback) {
	const filesRepository = new FilesRepository();
	const reportsRepository = new ReportsRepository();
	const request = new Request(event, context);
	const s3 = new S3();
	const settingsRepository = new SettingsRepository();

	let timezone = 'UTC';
	let report;
	let file;
	const path = UUID.v4();
	const filename = request.get('name', 'report') + '-' + getFilenameTimestamp() + '.csv';
	request.validate().then(function () {
		return reportsRepository.populate(request._body);
	}).then(function (populatedReport) {
		report = populatedReport;
		return filesRepository.populate({filename: filename.toLowerCase(), path: 'reports/' + path});
	}).then(function (populatedFile) {
		file = populatedFile;
		return settingsRepository.get(SettingHelper.SETTING_EVENT_TIMEZONE).then(function (response) {
			if (response) {
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
			return s3.putObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, `${file.path}`, csv, 'private', 'text/csv', `attachment; filename=${file.filename}`).then(function () {
				return filesRepository.upsert(file, {});
			}).then(function (file) {
				report.fileId = file.id;
				report.status = ReportHelper.STATUS_SUCCESS;
				return reportsRepository.upsert(report, {});
			});
		} else {
			report.status = ReportHelper.STATUS_FAILED;
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