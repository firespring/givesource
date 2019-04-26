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

const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const SSM = require('./../../aws/ssm');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));
	const ssm = new SSM();

	request.validate().then(function () {
		const key = '/' + process.env.AWS_STACK_NAME + '/settings/secure/' + request.urlParam('key');
		return ssm.getParameter(process.env.AWS_REGION, key, false);
	}).then(function (response) {
		let setting = {};
		if (response && response.Parameter) {
			setting = {
				key: response.Parameter.Name,
				type: response.Parameter.Type,
				value: response.Parameter.Value
			};
		}
		callback(null, setting);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};