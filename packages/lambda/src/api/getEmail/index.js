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

const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));
	const ses = new SES();

	request.validate().then(function () {
		return ses.listIdentities();
	}).then(function (response) {
		const identities = response.hasOwnProperty('Identities') ? response.Identities : [];
		if (identities.length) {
			return ses.getIdentityVerificationAttributes(identities);
		} else {
			return Promise.resolve([]);
		}
	}).then(function (response) {
		const results = [];
		if (response.hasOwnProperty('VerificationAttributes')) {
			Object.keys(response.VerificationAttributes).forEach(function (key) {
				results.push({
					email: key,
					verified: response.VerificationAttributes[key].VerificationStatus === 'Success',
				});
			});
		}
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};