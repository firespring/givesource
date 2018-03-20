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
const Request = require('./../../aws/request');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const repository = new SettingsRepository();
	const request = new Request(event, context);
	const keys = request.queryParam('keys', '').split(',');

	request.validate().then(function () {
		if (keys.length) {
			return repository.batchGet(keys);
		} else {
			return repository.getAll();
		}
	}).then(function (settings) {
		const results = settings.map(function (setting) {
			return setting.all();
		});
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};