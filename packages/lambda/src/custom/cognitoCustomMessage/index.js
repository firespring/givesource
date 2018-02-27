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

const FilesRepository = require('./../../repositories/files');
const logger = require('./../../helpers/log');
const querystring = require('querystring');
const RenderHelper = require('./../../helpers/render');
const SettingsRepository = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	logger.log('cognitoCustomMessage event: %j', event);

	const filesRepository = new FilesRepository();
	const settingsRepository = new SettingsRepository();

	let settings = {
		ADMIN_PAGES_CLOUD_FRONT_URL: process.env.ADMIN_PAGES_CLOUD_FRONT_URL,
		CONTACT_PHONE: null,
		EMAILS_USER_REGISTRATION_ACTIVATED: null,
		EVENT_LOGO: null,
		EVENT_TITLE: null,
		EVENT_URL: process.env.EVENT_URL,
		UPLOADS_CLOUD_FRONT_URL: process.env.UPLOADS_CLOUD_FRONT_URL,
	};

	let promise = Promise.resolve();
	if (event.triggerSource === 'CustomMessage_AdminCreateUser' || event.triggerSource === 'CustomMessage_ForgotPassword') {
		promise = promise.then(function () {
			return settingsRepository.batchGet(Object.keys(settings)).then(function (response) {
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
			});
		});
	}

	if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
		promise = promise.then(function () {
			return RenderHelper.renderTemplate('emails.registration-verify', {
				settings: settings,
				verificationUrl: settings.ADMIN_PAGES_CLOUD_FRONT_URL + '/login?id=' + event.request.usernameParameter + '&token=' + event.request.codeParameter,
			}).then(function (response) {
				event.response.emailSubject = `${settings.EVENT_TITLE} - Verify your email address`;
				event.response.emailMessage = response;
			});
		});
	}

	if (event.triggerSource === 'CustomMessage_ForgotPassword') {
		promise = promise.then(function () {
			return RenderHelper.renderTemplate('emails.forgot-password', {
				settings: settings,
				resetPasswordUrl: settings.ADMIN_PAGES_CLOUD_FRONT_URL + '/forgot-password/reset?' + querystring.stringify({email: event.request.userAttributes.email}) + '&code=' + event.request.codeParameter,
			}).then(function (response) {
				event.response.emailSubject = `${settings.EVENT_TITLE} - Your password reset request`;
				event.response.emailMessage = response;
			});
		});
	}

	promise.then(function () {
		callback(null, event);
	}).catch(function (err) {
		callback(err);
	});
};