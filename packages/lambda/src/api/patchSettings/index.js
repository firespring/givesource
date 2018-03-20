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

const _ = require('lodash');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const Setting = require('./../../models/setting');
const SettingsRepository = require('./../../repositories/settings');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const DynamicContentHelper = require('./../../helpers/dynamicContent');

exports.handle = function (event, context, callback) {
	const repository = new SettingsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['settings']);

	let settings = [];
	request.validate().then(function () {
		const keys = request.get('settings', []).map(function (setting) {
			return setting.key;
		});
		return repository.batchGet(keys).then(function (models) {
			request.get('settings', []).forEach(function (data) {
				let model = _.find(models, {key: data.key});
				if (model) {
					model.populate(data);
				} else {
					model = new Setting(data);
				}

				settings.push(model);
			});
		});
	}).then(function () {
		let promise = Promise.resolve();
		settings.forEach(function (setting) {
			promise = promise.then(function () {
				return setting.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchUpdate(settings);
	}).then(function () {
		return DynamicContentHelper.regenerateDynamicContent(_.map(settings, 'key'), process.env.AWS_REGION, process.env.AWS_STACK_NAME, false);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};