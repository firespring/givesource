/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const HttpException = require('./../../exceptions/http');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const QueryBuilder = require('./../../aws/queryBuilder');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitsRepository();
	const request = new Request(event, context);

	let total = 0;
	let items = [];
	const size = request.queryParam('size', 10);
	const sort = request.queryParam('sort', null);
	const start = request.queryParam('start', 0);

	request.validate().then(function () {
		const builder = new QueryBuilder('query');
		builder.select('COUNT').limit(1000).index('isDeletedCreatedOnIndex').condition('isDeleted', '=', 0).condition('createdOn', '>', 0).scanIndexForward(false);
		return repository.batchQuery(builder);
	}).then(function (response) {
		total = response.Count;
		if (start > 0) {
			const builder = new QueryBuilder('query');
			builder.select('COUNT').limit(start).index('isDeletedCreatedOnIndex').condition('isDeleted', '=', 0).condition('createdOn', '>', 0).scanIndexForward(false);
			return repository.query(builder);
		} else {
			return Promise.resolve({});
		}
	}).then(function (response) {
		const builder = new QueryBuilder('query');
		builder.limit(size).index('isDeletedCreatedOnIndex').condition('isDeleted', '=', 0).condition('createdOn', '>', 0).scanIndexForward(false);

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
			start: start,
			total: total
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};