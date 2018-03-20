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

const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const HttpException = require('./../../exceptions/http');
const MetricsHelper = require('./../../helpers/metrics');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new DonorsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let donor = null;
	request.validate().then(function () {
		if (request.get('email')) {
			return repository.queryEmail(request.get('email'));
		}
		return Promise.resolve();
	}).then(function (model) {
		if (model) {
			donor = model;
		} else {
			donor = new Donor();
			return MetricsHelper.addAmountToMetric('DONORS_COUNT', 1);
		}
	}).then(function () {
		donor.populate(request._body);
		return donor.validate();
	}).then(function () {
		return repository.save(donor);
	}).then(function (response) {
		callback(null, response.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};