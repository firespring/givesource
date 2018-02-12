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
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	logger.log('saveSettings event: %j', event);

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const models = [];
	const repository = new SettingsRepository();
	const settings = JSON.parse(event.ResourceProperties.Settings);
	let promise = Promise.resolve();

	Object.keys(settings).forEach(function (key) {
		if (settings.hasOwnProperty(key)) {
			promise = promise.then(function () {
				return getSettingValue(key, settings[key]).then(function (updatedValue) {
					const data = {};
					data.key = key;
					data.value = updatedValue;
					models.push(new Setting(data));
				})
			});
		}
	});

	promise = promise.then(function() {
		let subPromise = Promise.resolve();
		models.forEach(function (model) {
			subPromise = subPromise.then(function () {
				return model.validate().then(function () {
					return repository.save(model);
				});
			});
		});
		return subPromise;
	});

	promise = promise.then(function () {
		if (event.hasOwnProperty('ResponseURL')) {
			response.send(event, context, response.SUCCESS);
		} else {
			callback();
		}
	}).catch(function (err) {
		logger.log(err);
		if (event.hasOwnProperty('ResponseURL')) {
			response.send(event, context, response.FAILED);
		} else {
			callback(err);
		}
	});
};

const getSettingValue = function (key, value) {
	let promise = Promise.resolve();
	let finalValue = value;
	if (_.isPlainObject(value) && value.hasOwnProperty('type') && value.type === 'S3') {
		const s3 = new S3();
		promise = promise.then(function () {
			return s3.getObject(process.env.AWS_REGION, value.bucket, value.path).then(function (data) {
				finalValue = data.Body.toString();
			}).catch(function (err) {
				console.log(err);
			})
		});
	}

	promise = promise.then(function () {
		return finalValue;
	});

	return promise;
};