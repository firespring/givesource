/*
 * Copyright (C) 2018  Firespring
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

const EmailHelper = require('./../../helpers/email');
const FilesRepository = require('./../../repositories/files');
const RenderHelper = require('./../../helpers/render');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const filesRepository = new FilesRepository();
	const request = new Request(event, context).parameters(['message']);
	const ses = new SES();
	const settingsRepository = new SettingsRepository();

	let html = '';
	const message = request.get('message');
	let settings = {
		CONTACT_PHONE: null,
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

		console.log('settings: %j', settings);

		return RenderHelper.renderTemplate('emails.contact-message', {
			message: message,
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
		if (response.to.email && response.from.email && response.from.verified) {
			const subject = settings.EVENT_TITLE ? 'New contact message from ' + settings.EVENT_TITLE : 'New contact message';
			const toAddresses = [response.to.email];
			const replyToAddresses = [message.email];
			return ses.sendEmail(subject, html, null, response.from.email, toAddresses, replyToAddresses);
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