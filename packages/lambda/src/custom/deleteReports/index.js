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
const FilesRepository = require('./../../repositories/files');
const logger = require('./../../helpers/log');
const ReportsRepository = require('./../../repositories/reports');
const S3 = require("./../../aws/s3");

exports.handle = function (event, context, callback) {
	logger.log(`${context.functionName} event: %j`, event);
	const filesRepository = new FilesRepository();
	const reportsRepository = new ReportsRepository();
	const s3 = new S3();

	const expire = new Date();
	expire.setHours(expire.getHours() - 1);

	let filesCount = 0, processedCount = 0, reportsCount = 0;
	reportsRepository.getAll().then(function (reports) {
		let promise = Promise.resolve();
		reports.forEach(function (report) {
			processedCount += 1;
			if (report.createdOn <= expire.getTime()) {
				reportsCount += 1;
				if (report.fileUuid) {
					promise = promise.then(function () {
						return s3.deleteObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, `reports/${report.fileUuid}`).then(function () {
							filesCount += 1;
							return filesRepository.delete(report.fileUuid);
						});
					});
				}

				promise = promise.then(function () {
					return reportsRepository.delete(report.uuid);
				});
			}
		});
		return promise;
	}).then(function () {
		logger.log(`Reports processed: ${processedCount}. Reports deleted: ${reportsCount}. Files deleted: ${filesCount}.`);
		callback();
	}).catch(function (err) {
		console.log(err);
		callback();
	});
};