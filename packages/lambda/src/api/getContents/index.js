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
		results = [];
		contents.forEach(function (content) {
			if (content.get('type') === ContentHelper.TYPE_COLLECTION) {
				promise = promise.then(function () {
					return repository.getByParentId(content.id);
				}).then(function (models) {
					let values = [];
					models.forEach(function (result) {
						values.push(result);
					});
					content.set('value', values);
				});
			}
			results.push(content);
		});
		return promise;
	}).then(function () {
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};