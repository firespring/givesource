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

	const message = new Message(request._body);
	request.validate().then(function () {
		return message.validate();
	}).then(function () {
		return settingsRepository.get('CONTACT_EMAIL');
	}).then(function (setting) {
		if (setting) {
			return ses.sendEmail(message, [setting.value], setting.value);
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