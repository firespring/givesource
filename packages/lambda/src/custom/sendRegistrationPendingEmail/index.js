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

const EmailHelper = require('./../../helpers/email');
const FilesRepository = require('./../../repositories/files');
const RenderHelper = require('./../../helpers/render');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const filesRepository = new FilesRepository();
	const request = new Request(event, context).parameters(['email']);
	const ses = new SES();
	const settingsRepository = new SettingsRepository();

	let html = '';
	let settings = {
		CONTACT_PHONE: null,
		EMAILS_USER_REGISTRATION_PENDING: null,
		EVENT_URL: null,
		EVENT_TITLE: null,
		EVENT_LOGO: null,
		UPLOADS_CLOUD_FRONT_URL: null,
	};
	request.validate().then(function () {
		return settingsRepository.batchGet(Object.keys(settings));
	}).then(function (response) {
		response.forEach(function (setting) {
			settings[setting.key] = setting.value;
		});
	}).then(function () {
		if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
			return filesRepository.get(settings.EVENT_LOGO);
		} else {
			return Promise.resolve(null);
		}
	}).then(function (response) {
		if (response) {
			settings.EVENT_LOGO = settings.UPLOADS_CLOUD_FRONT_URL + '/' + response.path;
		}
		return RenderHelper.renderTemplate('emails.registration-pending', {
			settings: settings,
		});
	}).then(function (response) {
		if (response) {
			html = response;
			return EmailHelper.getContactEmailAddresses();
		} else {
			return Promise.reject(new Error('unable to generate receipt email'));
		}
	}).then(function (response) {
		if (response.from.email && response.from.verified) {
			const subject = settings.EVENT_TITLE ? settings.EVENT_TITLE + ' - Application in review' : 'Application in review';
			const toAddresses = [request.get('email')];
			return ses.sendEmail(subject, html, null, response.from.email, toAddresses);
		} else {
			return Promise.resolve();
		}
	}).then(function () {
		callback();
	}).catch(function (err) {
		console.log('Error: %j', err);
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};