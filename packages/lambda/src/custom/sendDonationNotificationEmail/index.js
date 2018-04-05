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

const _ = require('lodash');
const Donation = require('./../../models/donation');
const EmailHelper = require('./../../helpers/email');
const FilesRepository = require('./../../repositories/files');
const HttpException = require('./../../exceptions/http');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const NonprofitUsersRepostiory = require('./../../repositories/nonprofitUsers');
const RenderHelper = require('./../../helpers/render');
const Request = require('./../../aws/request');
const SES = require('./../../aws/ses');
const SettingsRepostiory = require('./../../repositories/settings');

exports.handle = function (event, context, callback) {
	const filesRepository = new FilesRepository();
	const request = new Request(event, context);
	const nonprofitsRepository = new NonprofitsRepository();
	const nonprofitUsersRepository = new NonprofitUsersRepostiory();
	const ses = new SES();
	const settingsRepository = new SettingsRepostiory();

	let donations = request.get('donations', []);
	let nonprofits = {};

	let settings = {
		ADMIN_URL: null,
		CONTACT_PHONE: null,
		EMAILS_DONATION_NOTIFICATION_BEFORE: null,
		EMAILS_DONATION_NOTIFICATION_AFTER: null,
		EVENT_URL: null,
		EVENT_TIMEZONE: null,
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

		if (settings.EVENT_LOGO && settings.UPLOADS_CLOUD_FRONT_URL) {
			return filesRepository.get(settings.EVENT_LOGO);
		} else {
			return Promise.resolve(null);
		}
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
		if (donations.length) {
			donations = donations.map(function (donation) {
				const model = new Donation(donation);
				return model.mutate(null, {timezone: settings.EVENT_TIMEZONE});
			});
		}

		let promise = Promise.resolve();
		donations.forEach(function (donation) {
			if (!nonprofits.hasOwnProperty(donation.nonprofitUuid)) {
				nonprofits[donation.nonprofitUuid] = {
					donations: [],
					users: []
				};

				promise = promise.then(function () {
					return nonprofitsRepository.get(donation.nonprofitUuid);
				}).then(function (response) {
					if (response.receiveDonationNotifications) {
						return nonprofitUsersRepository.getAll(donation.nonprofitUuid);
					} else {
						callback();
					}
				}).then(function (response) {
					nonprofits[donation.nonprofitUuid].users = response;
				});
			}
			nonprofits[donation.nonprofitUuid].donations.push(donation);
		});

		return promise;
	}).then(function () {
		return EmailHelper.getContactEmailAddresses();
	}).then(function (response) {
		if (response.from.email && response.from.verified) {
			return Promise.resolve(response.from.email);
		} else {
			return Promise.reject(new Error('from contact email address missing or not verified'));
		}
	}).then(function (fromAddress) {
		let promise = Promise.resolve();
		Object.keys(nonprofits).forEach(function (nonprofitUuid) {
			promise = promise.then(function () {
				return RenderHelper.renderTemplate('emails.donation-notification', {
					donations: nonprofits[nonprofitUuid].donations,
					settings: settings
				});
			}).then(function (response) {
				const toAddresses = nonprofits[nonprofitUuid].users.map(function (user) {
					return user.email;
				});
				const subject = 'Your organization just received a donation.';
				return ses.sendEmail(subject, response, null, fromAddress, toAddresses);
			});
		});
	}).then(function () {
		callback();
	}).catch(function (err) {
		console.log('Error: %j', err);
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};