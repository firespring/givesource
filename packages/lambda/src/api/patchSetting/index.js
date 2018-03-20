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
const Setting = require('./../../models/setting');
const SettingsRepository = require('./../../repositories/settings');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const DynamicContentHelper = require('./../../helpers/dynamicContent');

exports.handle = function (event, context, callback) {
	const repository = new SettingsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let setting = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('key'));
	}).then(function (result) {
		setting = new Setting(result);
		setting.populate(request._body);
		return setting.validate();
	}).then(function () {
		return repository.save(setting);
	}).then(function (model) {
		let promise = Promise.resolve();
		promise = promise.then(function () {
			return DynamicContentHelper.regenerateDynamicContent([model.key], process.env.AWS_REGION, process.env.AWS_STACK_NAME, false);
		});

		promise = promise.then(function () {
			return model;
		});

		return promise;
	}).then(function (model) {
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};