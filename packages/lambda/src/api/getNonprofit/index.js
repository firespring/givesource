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
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context);
	const repository = new NonprofitsRepository();

	let nonprofit;
	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_id'));
	}).then(function (popNp) {
		nonprofit = popNp;
		return repository.donationsSummary(request.urlParam('nonprofit_id'));
	}).then(function (summary) {
		nonprofit.setDataValue('donationsCount', summary[0].count);
		nonprofit.setDataValue('donationsSubtotal', summary[0].amountForNonprofit);
		callback(null, nonprofit);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};