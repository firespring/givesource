/*
 * Copyright (C) 2018  Firespring
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

const ContentHelper = require('./../../helpers/content');
const ContentsRepository = require('./../../repositories/contents');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new ContentsRepository();
	const request = new Request(event, context).queryParameters(['keys']);
	const keys = request.queryParam('keys', '').split(',');

	let results = [];
	request.validate().then(function () {
		return repository.batchGet(keys);
	}).then(function (contents) {
		let promise = Promise.resolve();
		contents.forEach(function (content) {
			const result = content.all();
			if (content.type === ContentHelper.TYPE_COLLECTION) {
				promise = promise.then(function () {
					return repository.getByParentUuid(content.uuid).then(function (response) {
						result.value = response.map(function (model) {
							return model.all();
						});
						results.push(result);
					});
				});
			} else {
				promise = promise.then(function () {
					results.push(result);
				});
			}
		});
		return promise;
	}).then(function () {
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};