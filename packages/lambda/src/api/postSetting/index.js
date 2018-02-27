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
const Request = require('./../../aws/request');
const ResourceAlreadyExistsException = require('./../../exceptions/resourceAlreadyExists');
const Setting = require('./../../models/setting');
const SettingsRepository = require('./../../repositories/settings');
const UserGroupMiddleware = require('./../../middleware/userGroup');
const DynamicContentHelper = require('./../../helpers/dynamicContent');

exports.handle = function (event, context, callback) {
	const repository = new SettingsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	const setting = new Setting(request._body);
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