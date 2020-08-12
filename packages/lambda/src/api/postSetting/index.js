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
const Lambda = require('./../../aws/lambda');
const Request = require('./../../aws/request');
const ResourceAlreadyExistsException = require('./../../exceptions/resourceAlreadyExists');
const Setting = require('../../models/setting');
const SettingsRepository = require('./../../repositories/settings');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const DynamicContentHelper = require('./../../helpers/dynamicContent');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
	const repository = new SettingsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let setting = new Setting(request._body);
	request.validate().then(function () {
		return new Promise(function (resolve, reject) {
			repository.get(request.get('key')).then(function () {
				reject(new ResourceAlreadyExistsException('The setting: ' + request.get('key') + ' already exists'));
			}).catch(function () {
				resolve();
			});
		});
	}).then(function () {
		return setting.validate();
	}).then(function () {
		return repository.save(setting);
	}).then(function (response) {
		setting = response;
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
	}).then(function () {
		return DynamicContentHelper.regenerateDynamicContent([setting.key], process.env.AWS_REGION, process.env.AWS_STACK_NAME, false);
	}).then(function () {
		callback(null, setting.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};
