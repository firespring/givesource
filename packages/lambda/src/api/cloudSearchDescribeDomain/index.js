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
	logger.log('cloudSearchDescribeDomain event: %j', event);

	const cloudSearch = new CloudSearch();
	const domainName = event.ResourceProperties.DomainName;

	if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	cloudSearch.describeDomains([domainName]).then(function (result) {
		if (result.hasOwnProperty('DomainStatusList') && result.DomainStatusList.length > 0) {
			const data = result.DomainStatusList[0];
			response.send(event, context, response.SUCCESS, {
				DocServiceEndpoint: data.DocService.Endpoint,
				SearchServiceEndpoint: data.SearchService.Endpoint,
			}, data.DomainId);
		} else {
			response.send(event, context, response.FAILED);
		}
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};