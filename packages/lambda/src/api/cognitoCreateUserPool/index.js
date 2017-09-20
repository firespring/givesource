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

const Cognito = require('./../../aws/cognito');
const logger = require('./../../helpers/log');
const response = require('cfn-response');

exports.handle = function (event, context, callback) {
	logger.log('cognitoCreateUserPool event: %j', event);

	const poolName = event.ResourceProperties.PoolName;
	const adminPageUrl = event.ResourceProperties.AdminPageUrl;
	const snsCallerArn = event.ResourceProperties.SnsCallerArn;

	const cognito = new Cognito();
	if (event.RequestType === 'Delete') {
		const userPoolId = event.PhysicalResourceId.UserPoolId;
		cognito.deleteUserPool(userPoolId).then(function () {
			response.send(event, context, response.SUCCESS, {UserPoolId: userPoolId}, userPoolId);
		}).catch(function (err) {
			logger.log(err);
			response.send(event, context, response.FAILED);
		});
		return;
	}

	if (event.RequestType === 'Update') {
		const userPoolId = event.PhysicalResourceId;
		response.send(event, context, response.SUCCESS, {UserPoolId: userPoolId}, userPoolId);
		return;
	}

	cognito.createUserPool(poolName, 'Givesource', adminPageUrl, snsCallerArn).then(function (userPool) {
		const userPoolId = userPool.UserPool.Id;
		response.send(event, context, response.SUCCESS, {UserPoolId: userPoolId}, userPoolId);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};