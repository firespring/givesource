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

const Cognito = require('./../../aws/cognito');
const logger = require('./../../helpers/log');
const response = require('cfn-response');

exports.handle = function (event, context) {
	logger.log('cognitoCreateUserPool event: %j', event);

	const poolName = event.ResourceProperties.PoolName;
	const snsCallerArn = event.ResourceProperties.SnsCallerArn;
	const cognitoCustomMessageArn = process.env.COGNITO_CUSTOM_MESSAGE_FUNCTION_ARN;

	const cognito = new Cognito();
	if (event.RequestType === 'Delete') {
		const userPoolId = event.PhysicalResourceId.UserPoolId;
		cognito.deleteUserPool(process.env.AWS_REGION, userPoolId).then(function () {
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

	cognito.createUserPool(process.env.AWS_REGION, poolName, snsCallerArn, cognitoCustomMessageArn).then(function (userPool) {
		const userPoolId = userPool.UserPool.Id;
		response.send(event, context, response.SUCCESS, {UserPoolId: userPoolId}, userPoolId);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};