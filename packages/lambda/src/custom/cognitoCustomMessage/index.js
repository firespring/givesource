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

exports.handle = function (event, context, callback) {
	logger.log('cognitoCustomMessage event: %j', event);

	if (event.triggerSource === 'CustomMessage_ForgotPassword') {
		const adminPageUrl = process.env.ADMIN_PAGES_CLOUD_FRONT_URL;
		event.response.emailSubject = 'Givesource - Your password reset request';

		let qs = querystring.stringify({email: event.request.userAttributes.email});
		qs += '&code=' + event.request.codeParameter;

		event.response.emailMessage = 'Please <a href="' + adminPageUrl + '/forgot-password/reset?' + qs + '">click here</a> to reset your password.';
	}

	callback(null, event);
};