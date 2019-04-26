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
const Lambda = require('./../../aws/lambda');
const Request = require('./../../aws/request');
const SponsorTier = require('./../../models/sponsorTier');
const SponsorTiersRepository = require('./../../repositories/sponsorTiers');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
	const repository = new SponsorTiersRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['sponsorTiers']);

	let sponsorTiers = [];
	request.validate().then(function () {
		request.get('sponsorTiers', []).forEach(function (data) {
			sponsorTiers.push(new SponsorTier(data));
		});
	}).then(function () {
		let promise = Promise.resolve();
		sponsorTiers.forEach(function (sponsorTier) {
			promise = promise.then(function () {
				return sponsorTier.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchUpdate(sponsorTiers);
	}).then(function () {
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};