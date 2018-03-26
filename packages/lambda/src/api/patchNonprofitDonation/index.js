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

const Donation = require('./../../models/donation');
const HttpException = require('./../../exceptions/http');
const NonprofitDonationsRepository = require('./../../repositories/nonprofitDonations');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitDonationsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let donation = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_uuid'), request.urlParam('donation_uuid'));
	}).then(function (result) {
		donation = new Donation(result);
		donation.populate(request._body);
		return donation.validate();
	}).then(function () {
		return repository.save(request.urlParam('nonprofit_uuid'), donation);
	}).then(function (model) {
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};