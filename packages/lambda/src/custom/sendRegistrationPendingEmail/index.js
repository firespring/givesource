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
const RenderHelper = require('./../../helpers/render');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).parameters(['email']);
	const ses = new SES();
	const settingsRepository = new SettingsRepository();

	let html = '';
	let settings = {
		CONTACT_PHONE: null,
		EVENT_URL: null,
		EVENT_TITLE: null,
		EVENT_LOGO: null,
	};
	request.validate().then(function () {
		return settingsRepository.batchGet(Object.keys(settings));
	}).then(function (response) {
		response.forEach(function (setting) {
			settings[setting.key] = setting.value;
		});
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