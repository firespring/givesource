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

const logger = require('./../../helpers/log');
const response = require('cfn-response');
const Setting = require('./../../models/setting');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	logger.log('initialStackSettings event: %j', event);

	const models = [];
	const repository = new SettingsRepository();
	const settings = JSON.parse(event.ResourceProperties.Settings);

	Object.keys(settings).forEach(function (key) {
		if (settings.hasOwnProperty(key)) {
			const data = {};
			data.key = key;
			data.value = settings[key];
			models.push(new Setting(data));
		}
	});

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	let promise = Promise.resolve();
	models.forEach(function (model) {
		promise = promise.then(function () {
			return model.validate().then(function () {
				return repository.save(model);
			});
		});
	});

	promise = promise.then(function () {
		response.send(event, context, response.SUCCESS);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};