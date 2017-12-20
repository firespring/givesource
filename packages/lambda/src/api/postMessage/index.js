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
const Message = require('./../../models/message');
const MessagesRepository = require('./../../repositories/messages');
const Request = require('./../../aws/request');
const SettingsRepository = require('./../../repositories/settings');
const SES = require('./../../aws/ses');

exports.handle = function (event, context, callback) {
	const repository = new MessagesRepository();
	const request = new Request(event, context);
	const settingsRepository = new SettingsRepository();
	const ses = new SES();

	let to = null;
	let from = null;
	const message = new Message(request._body);

	request.validate().then(function () {
		return message.validate();
	}).then(function () {
		return settingsRepository.batchGet(['CONTACT_EMAIL', 'SENDER_EMAIL']);
	}).then(function (settings) {
		if (settings.length) {
			to = getSettingValue(settings, 'CONTACT_EMAIL');
			from = getSettingValue(settings, 'SENDER_EMAIL');
		}
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
		return Promise.resolve(results);
	}).then(function (response) {
		let emailSetting = null;
		if (response.length && from) {
			emailSetting = _.find(response, {email: from});
		}
		if (emailSetting && emailSetting.verified) {
			return ses.sendEmail(message, [to], from);
		} else {
			return Promise.resolve();
		}
	}).then(function () {
		return repository.save(message);
	}).then(function (model) {
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};

const getSettingValue = function (settings, key) {
	let result = null;
	if (settings.length) {
		result = _.find(settings, {key: key});
	}
	return result ? result.value : null;
};