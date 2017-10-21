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

const AWS = require('aws-sdk');
const axios = require('axios');
const logger = require('./../../helpers/log');
const response = require('cfn-response');

exports.handle = function (event, context, callback) {
	logger.log('cloudSearchDomainWaitCondition event: %j', event);

	const callbackUrl = event.ResourceProperties.CallbackUrl;
	const healthCheckUrl = event.ResourceProperties.HealthCheckUrl;
	const reportStatusToCloudFormation = event.ResourceProperties.ReportStatusToCloudFormation;

	if (event.RequestType === 'Delete' || event.RequestType === 'Update') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	event.ResourceProperties.ReportStatusToCloudFormation = false;
	axios.get(healthCheckUrl + 'cloudsearch').then(function () {
		logger.log('health check passed');
		return axios({
			method: 'put',
			url: decodeURI(callbackUrl),
			data: {
				Status: 'SUCCESS',
				Reason: 'CloudSearchDomains health check passed',
				Data: '',
				UniqueId: 'CloudSearchDomainsHealthCheckRecursive-' + new Date().getTime(),
			},
			headers: {
				'Content-Type': ''
			}
		});
	}).then(function () {
		if (reportStatusToCloudFormation) {
			response.send(event, context, response.SUCCESS);
		}
	}).catch(function () {
		logger.log('health check failed, retrying...');
		const lambda = new AWS.Lambda();
		const params = {
			FunctionName: context.functionName,
			InvocationType: 'Event',
			Payload: JSON.stringify(event),
		};
		setTimeout(function () {
			lambda.invoke(params, function () {
				if (reportStatusToCloudFormation) {
					response.send(event, context, response.SUCCESS);
				}
			});
		}, 60000);
	});

};