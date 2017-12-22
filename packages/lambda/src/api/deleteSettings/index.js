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
const Setting = require('./../../models/setting');
const SettingsRepository = require('./../../repositories/settings');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new SettingsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['settings']);

	let settings = [];
	request.validate().then(function () {
		request.get('settings', []).forEach(function (data) {
			settings.push(new Setting(data));
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
		return repository.batchDeleteByKey(settings);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};