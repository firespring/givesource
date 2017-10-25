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
const NonprofitDonationTier = require('./../../models/nonprofitDonationTier');
const NonprofitDonationTiersRepository = require('./../../repositories/nonprofitDonationTiers');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitDonationTiersRepository();
	const request = new Request(event, context).parameters(['donation_tiers']);

	let donationTiers = [];
	request.validate().then(function () {
		request.get('donation_tiers', []).forEach(function (data) {
			const donationTier = new NonprofitDonationTier(data);
			donationTier.populate({nonprofitUuid: request.urlParam('nonprofit_uuid')});
			donationTiers.push(donationTier);
		});
	}).then(function () {
		let promise = Promise.resolve();
		donationTiers.forEach(function (donationTier) {
			promise = promise.then(function () {
				return donationTier.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchSave(request.urlParam('nonprofit_uuid'), donationTiers);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};