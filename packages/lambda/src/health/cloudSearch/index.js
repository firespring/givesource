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

const CloudSearch = require('./../../aws/cloudSearch');
const HttpException = require('./../../exceptions/http');
const logger = require('./../../helpers/log');
const UnhealthyResourceException = require('./../../exceptions/unhealthyResource');

exports.handle = function (event, context, callback) {
	logger.log('cloudSearchHealth event: %j', event);

	const cloudSearch = new CloudSearch();
	const stackName = process.env.AWS_STACK_NAME;
	const domains = [
		`${stackName}-Donations`,
		`${stackName}-Donors`,
		`${stackName}-Nonprofits`
	];

	cloudSearch.describeDomains(domains).then(function (response) {
		return new Promise(function (resolve, reject) {
			if (!response.hasOwnProperty('DomainStatusList') || response.DomainStatusList.length === 0) {
				reject(new UnhealthyResourceException('No CloudSearch domain(s) available.'));
			}

			let processing = false;
			response.DomainStatusList.forEach(function (domainStatus) {
				if (domainStatus.Processing) {
					processing = true;
				}
			});

			if (processing) {
				reject(new UnhealthyResourceException('CloudSearch domain(s) are still processing.'));
			} else {
				resolve();
			}
		});
	}).then(function () {
		callback(null, {});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};