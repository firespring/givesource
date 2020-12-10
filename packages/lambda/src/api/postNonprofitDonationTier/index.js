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
const NonprofitDonationTiersRepository = require('./../../repositories/nonprofitDonationTiers');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitDonationTiersRepository();
	const request = new Request(event, context);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_id'), ['SuperAdmin', 'Admin']));

	let donationTier;
	request.validate().then(function () {
		return repository.populate(request._body);
	}).then(function (populatedDonationTier) {
		donationTier = populatedDonationTier;
		return repository.upsert(donationTier, {nonprofitId: request.urlParam('nonprofit_id')});
	}).then(function (model) {
		callback(null, model[0]);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};
