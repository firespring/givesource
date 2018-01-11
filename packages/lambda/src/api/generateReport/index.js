/*
 * Copyright (C) 2018  Firespring
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

const _ = require('lodash');
const DonationsRepository = require('./../../repositories/donations');
const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const File = require('./../../models/file');
const FilesRepository = require('./../../repositories/files');
const json2csv = require('json2csv');
const NonprofitDonationsRepository = require('./../../repositories/nonprofitDonations');
const PaymentTransaction = require('./../../models/paymentTransaction');
const PaymentTransactionsRepository = require('./../../repositories/paymentTransactions');
const Report = require('./../../models/report');
const ReportHelper = require('./../../helpers/report');
const ReportsRepository = require('./../../repositories/reports');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	const filesRepository = new FilesRepository();
	const reportsRepository = new ReportsRepository();
	const request = new Request(event, context);
	const s3 = new S3();

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
		if (report.status === ReportHelper.STATUS_PENDING) {
			switch (report.type) {
				case ReportHelper.TYPE_DONATIONS:
					return getDonationsData(report);

				default:
					return Promise.resolve();
			}
		}
	}).then(function (data) {
		if (data && data.length) {
			const csv = json2csv({data: data, fields: Object.keys(data[0])});
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
 * @return {Promise}
 */
const getDonationsData = function (report) {
	const donorsRepository = new DonorsRepository();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();

	let donations = [];
	let promise = Promise.resolve();
	if (report.nonprofitUuid) {
		const donationsRepository = new NonprofitDonationsRepository();
		promise = promise.then(function () {
			donationsRepository.getAll(report.nonprofitUuid).then(function (response) {
				donations = response;
			});
		});
	} else {
		const donationsRepository = new DonationsRepository();
		promise = promise.then(function () {
			return donationsRepository.getAll();
		}).then(function (response) {
			donations = response;
		});
	}

	let donors = [];
	promise = promise.then(function () {
		return donorsRepository.getAll();
	}).then(function (response) {
		donors = response;
	});

	let paymentTransactions = [];
	promise = promise.then(function () {
		return paymentTransactionsRepository.getAll();
	}).then(function (response) {
		paymentTransactions = response;
	});

	const data = [];
	promise = promise.then(function () {
		donations.forEach(function (donation) {
			const item = {};

			Object.keys(donation.all()).forEach(function (key) {
				item['donation-' + key] = donation.all()[key];
			});

			const donor = _.find(donors, {uuid: donation.donorUuid});
			if (donor && !donation.isAnonymous) {
				Object.keys(donor.all()).forEach(function (key) {
					item['donor-' + key] = donor.all()[key];
				});
			} else {
				const temp = new Donor();
				Object.keys(temp.all()).forEach(function (key) {
					item['donor-' + key] = '';
				});
			}

			const paymentTransaction = _.find(paymentTransactions, {uuid: donation.paymentTransactionUuid});
			if (paymentTransaction) {
				Object.keys(paymentTransaction.all()).forEach(function (key) {
					item['paymentTransaction-' + key] = paymentTransaction.all()[key];
				});
			} else {
				const temp = new PaymentTransaction();
				Object.keys(temp.all()).forEach(function (key) {
					item['paymentTransaction-' + key] = '';
				});
			}

			data.push(item);
		});
	}).then(function () {
		return Promise.resolve(data);
	});

	return promise;
};