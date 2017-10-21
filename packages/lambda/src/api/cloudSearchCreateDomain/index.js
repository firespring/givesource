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
const logger = require('./../../helpers/log');
const response = require('cfn-response');

exports.handle = function (event, context, callback) {
	logger.log('cloudSearchCreateDomain event: %j', event);

	const cloudSearch = new CloudSearch();
	const domainName = event.ResourceProperties.DomainName;

	if (event.RequestType === 'Delete') {
		cloudSearch.deleteDomain(domainName).then(function () {
			response.send(event, context, response.SUCCESS);
		}).catch(function (err) {
			logger.log(err);
			response.send(event, context, response.FAILED);
		});
		return;
	}

	if (event.RequestType === 'Update') {
		response.send(event, context, response.FAILED);
		return;
	}

	cloudSearch.createDomain(domainName).then(function (result) {
		response.send(event, context, response.SUCCESS, result.DomainStatus);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};