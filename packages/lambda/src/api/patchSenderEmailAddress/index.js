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

const Cognito = require('./../../aws/cognito');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['email']);
	const cognito = new Cognito();
	const ses = new SES();

	const cognitoCustomMessageArn = process.env.COGNITO_CUSTOM_MESSAGE_FUNCTION_ARN;
	const snsCallerRoleArn = process.env.COGNITO_SNS_CALLER_ROLE_ARN;
	const fromEmailAddressArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:identity/${request.get('email')}`;
	const policy = {
		Version: '2008-10-17',
		Statement: [
			{
				Sid: 'stmnt' + new Date().getTime(),
				Effect: 'Allow',
				Principal: {
					Service: 'cognito-idp.amazonaws.com'
				},
				Action: [
					'ses:SendEmail',
					'ses:SendRawEmail',
				],
				Resource: fromEmailAddressArn,
			}
		]
	};

	request.validate().then(function () {
		return ses.updatePolicy(fromEmailAddressArn, JSON.stringify(policy), process.env.AWS_STACK_NAME + '-SendEmailPolicy');
	}).then(function () {
		return cognito.updateUserPool(process.env.USER_POOL_ID, snsCallerRoleArn, cognitoCustomMessageArn, fromEmailAddressArn);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};