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

const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context);
	const ses = new SES();

	request.validate().then(function () {
		return ses.listIdentities();
	}).then(function (response) {
		const identities = response.hasOwnProperty('Identities') ? response.Identities : [];
		if (identities.length) {
			return ses.getIdentityVerificationAttributes(identities);
		} else {
			return Promise.resolve([]);
		}
	}).then(function (response) {
		const results = [];
		if (response.hasOwnProperty('VerificationAttributes')) {
			Object.keys(response.VerificationAttributes).forEach(function (key) {
				results.push({
					email: key,
					verified: response.VerificationAttributes[key].VerificationStatus === 'Success',
				});
			});
		}
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};