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