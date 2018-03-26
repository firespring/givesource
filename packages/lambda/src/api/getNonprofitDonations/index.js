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
const NonprofitDonationsRepository = require('./../../repositories/donations');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const QueryBuilder = require('./../../aws/queryBuilder');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitDonationsRepository();
	const request = new Request(event, context);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));

	let total = 0;
	let items = [];
	const nonprofitUuid = request.urlParam('nonprofit_uuid');
	const size = request.queryParam('size', 10);
	const sort = request.queryParam('sort', null);
	const start = request.queryParam('start', 0);

	request.validate().then(function () {
		const builder = new QueryBuilder('query');
		builder.select('COUNT').limit(1000).index('nonprofitUuidCreatedOnIndex').condition('nonprofitUuid', '=', nonprofitUuid).condition('createdOn', '>', 0).scanIndexForward(false);
		return repository.batchQuery(builder);
	}).then(function (response) {
		total = response.Count;
		if (start > 0) {
			const builder = new QueryBuilder('query');
			builder.select('COUNT').limit(start).index('nonprofitUuidCreatedOnIndex').condition('nonprofitUuid', '=', nonprofitUuid).condition('createdOn', '>', 0).scanIndexForward(false);
			return repository.query(builder);
		} else {
			return Promise.resolve({});
		}
	}).then(function (response) {
		const builder = new QueryBuilder('query');
		builder.limit(size).index('nonprofitUuidCreatedOnIndex').condition('nonprofitUuid', '=', nonprofitUuid).condition('createdOn', '>', 0).scanIndexForward(false);

		if (response.hasOwnProperty('LastEvaluatedKey')) {
			builder.start(response.LastEvaluatedKey);
		}

		return repository.query(builder);
	}).then(function (response) {
		if (response.hasOwnProperty('Items')) {
			items = response.Items;
		}
		callback(null, {
			items: items,
			size: size,
			sort: sort,
			start: start,
			total: total
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};