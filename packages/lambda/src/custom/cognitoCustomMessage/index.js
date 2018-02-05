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
const querystring = require('querystring');
const RenderHelper = require('./../../helpers/render');

exports.handle = function (event, context, callback) {
	logger.log('cognitoCustomMessage event: %j', event);
	let promise = Promise.resolve();

	if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
		const adminUrl = process.env.ADMIN_PAGES_CLOUD_FRONT_URL;
		const eventUrl = process.env.PUBLIC_PAGES_CLOUD_FRONT_URL;
		const eventTitle = process.env.EVENT_TITLE;

		promise = promise.then(function () {
			return RenderHelper.renderTemplate('emails/registration-verify', {
				eventTitle: eventTitle,
				eventUrl: eventUrl,
				verificationUrl: adminUrl + '/login?id=' + event.request.usernameParameter + '&token=' + event.request.codeParameter,
			}).then(function (response) {
				event.response.emailSubject = `${eventTitle} - Verify your email address`;
				event.response.emailMessage = response;
			});
		});
	}

	if (event.triggerSource === 'CustomMessage_ForgotPassword') {
		const adminUrl = process.env.ADMIN_PAGES_CLOUD_FRONT_URL;
		const eventUrl = process.env.PUBLIC_PAGES_CLOUD_FRONT_URL;
		const eventTitle = process.env.EVENT_TITLE;

		promise = promise.then(function () {
			return RenderHelper.renderTemplate('emails/forgot-password', {
				eventTitle: eventTitle,
				eventUrl: eventUrl,
				resetPasswordUrl: adminUrl + '/forgot-password/reset?' + querystring.stringify({email: event.request.userAttributes.email}) + '&code=' + event.request.codeParameter,
			}).then(function (response) {
				event.response.emailSubject = `${eventTitle} - Your password reset request`;
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