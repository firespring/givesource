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

const Donation = require('./../../models/donation');
const CloudSearch = require('./../../aws/cloudSearch');
const HttpException = require('./../../exceptions/http');
const ModelHelper = require('./../../helpers/model');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const cloudSearch = new CloudSearch();
	const request = new Request(event, context);
	const searchServiceEndpoint = process.env.SEARCH_SERVICE_ENDPOINT;

	let total = 0;
	const items = [];
	const size = request.queryParam('size', 10);
	const sort = request.queryParam('sort', null);
	const start = request.queryParam('start', 0);

	request.validate().then(function () {
		const options = {
			queryParser: 'structured',
			size: size,
			start: start
		};
		if (sort) {
			options.sort = sort;
		}
		return cloudSearch.search(searchServiceEndpoint, 'matchall', options);
	}).then(function (results) {
		total = results.hits.found;
		let promise = Promise.resolve();
		results.hits.hit.forEach(function (data) {
			if (data.fields) {
				const fields = JSON.parse(JSON.stringify(data.fields));
				const model = new Donation();
				const params = ModelHelper.convertCloudSearchFields(model, fields);

				model.populate(params);
				items.push(model.all());
				promise = promise.then(function () {
					return model.validate();
				});
			}
		});
	}).then(function () {
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