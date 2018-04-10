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

exports.handle = function (event, context, callback) {
	logger.log('cognitoCreateUserPoolClient event: %j', event);

	if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
		const userPoolClientId = event.PhysicalResourceId;
		response.send(event, context, response.SUCCESS, {UserPoolClientId: userPoolClientId}, userPoolClientId);
		return;
	}

	const cognito = new Cognito();
	const userPoolId = event.ResourceProperties.UserPoolId;
	const clientName = event.ResourceProperties.ClientName;
	cognito.createUserPoolClient(process.env.AWS_REGION, userPoolId, clientName).then(function (userPoolClient) {
		const userPoolClientId = userPoolClient.UserPoolClient.ClientId;
		response.send(event, context, response.SUCCESS, {UserPoolClientId: userPoolClientId}, userPoolClientId);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};