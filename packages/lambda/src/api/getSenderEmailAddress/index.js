/*
 * Copyright 2019 Firespring, Inc.
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
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));
	const cognito = new Cognito();

	request.validate().then(function () {
		return cognito.describeUserPool(process.env.AWS_REGION, process.env.USER_POOL_ID);
	}).then(function (response) {
		let email = 'no-reply@verificationemail.com';
		if (response.hasOwnProperty('EmailConfiguration') && response.EmailConfiguration.hasOwnProperty('SourceArn')) {
			const fromEmailAddressArn = response.EmailConfiguration.SourceArn;
			const parts = fromEmailAddressArn.split('identity/');
			if (parts.length > 1) {
				email = parts[parts.length - 1];
			}
		}
		return Promise.resolve(email);
	}).then(function (response) {
		callback(null, {email: response});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};