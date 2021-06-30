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

const _ = require('lodash');
const logger = require('./../../helpers/log');
const response = require('cfn-response');
const SettingsRepository = require('./../../repositories/settings');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	logger.log('saveSettings event: %j', event);

	if (event.RequestType === 'Delete' || event.RequestType === 'Update') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const bulkData = [];
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
					data.createdAt = new Date();
					data.updatedAt = new Date();
					bulkData.push(data);
				})
			});
		}
	});

	promise = promise.then(function() {
		return repository.bulkCreate(bulkData);
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
