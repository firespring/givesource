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
const NonprofitDonationTier = require('./../../dynamo-models/nonprofitDonationTier');
const NonprofitDonationTiersRepository = require('./../../repositories/nonprofitDonationTiers');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitDonationTiersRepository();
	const request = new Request(event, context).parameters(['donation_tiers']);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));

	let donationTiers = [];
	request.validate().then(function () {
		request.get('donation_tiers', []).forEach(function (data) {
			const donationTier = new NonprofitDonationTier(data);
			donationTier.populate({nonprofitUuid: request.urlParam('nonprofit_uuid')});
			donationTiers.push(donationTier);
		});
	}).then(function () {
		let promise = Promise.resolve();
		donationTiers.forEach(function (donationTier) {
			promise = promise.then(function () {
				return donationTier.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchSave(request.urlParam('nonprofit_uuid'), donationTiers);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};