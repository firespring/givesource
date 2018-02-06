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

const _ = require('lodash');
const SES = require('./../aws/ses');
const SettingsRepository = require('./../repositories/settings');

/**
 * Get contact email addresses and their verification status
 */
exports.getContactEmailAddresses = function () {
	const repository = new SettingsRepository();
	const ses = new SES();

	let from = null, to = null;
	return repository.batchGet(['CONTACT_EMAIL', 'SENDER_EMAIL']).then(function (settings) {
		if (settings.length) {
			to = _getSettingValue(settings, 'CONTACT_EMAIL');
			from = _getSettingValue(settings, 'SENDER_EMAIL');
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
		const addresses = {
			to: _.find(results, {email: to}),
			from: _.find(results, {email: from})
		};
		return Promise.resolve(addresses);
	});
};

/**
 * Get a setting's value from a collection of settings
 *
 * @param {[]} settings
 * @param {String} key
 * @return {null}
 * @private
 */
const _getSettingValue = function (settings, key) {
	let result = null;
	if (settings.length) {
		result = _.find(settings, {key: key});
	}
	return result ? result.value : null;
};

