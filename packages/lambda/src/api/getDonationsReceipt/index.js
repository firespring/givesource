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

const Lambda = require('./../../aws/lambda');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = (event, context, callback) => {
	const lambda = new Lambda();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	const email = request.queryParam('email', null);

	request.validate().then(() => {
		if (email) {
			return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-GenerateDonationsReceipt', {body: {email: email}}, 'RequestResponse');
		}
		return Promise.resolve();
	}).then(response => {
		const payload = JSON.parse(response.Payload);
		if (payload.html) {
			callback(null, {
				html: payload.html,
			});
		} else {
			return Promise.reject(new Error('Unable to process your request'));
		}
	}).catch(err => {
		console.log('Error: %j', err);
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};