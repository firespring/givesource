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

const Cognito = require('./../../aws/cognito');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));
	const cognito = new Cognito();

	request.validate().then(function () {
		return cognito.describeUserPool(process.env.USER_POOL_ID);
	}).then(function (response) {
		let email = 'no-reply@verificationemail.com';
		if (response.hasOwnProperty('EmailConfiguration') && response.EmailConfiguration.hasOwnProperty('SourceArn')) {
			const fromEmailAddressArn = response.EmailConfiguration.SourceArn;
			const parts = fromEmailAddressArn.split('identity/');
			if (parts.length > 1) {
				email = parts[parts.length - 1];
			}
		}
		return Promise.resolve(email);
	}).then(function (response) {
		callback(null, {email: response});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};