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

const Donation = require('./../../models/donation');
const HttpException = require('./../../exceptions/http');
const NonprofitDonationsRepository = require('./../../repositories/nonprofitDonations');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const donationsRepository = new NonprofitDonationsRepository();
	const nonprofitsRepository = new NonprofitsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let nonprofit = null;
	let donation = new Donation({nonprofitUuid: request.urlParam('nonprofit_uuid')});
	request.validate().then(function () {
		donation.populate(request._body);
		return donation.validate();
	}).then(function () {
		return nonprofitsRepository.get(request.urlParam('nonprofit_uuid'));
	}).then(function (response) {
		nonprofit = response;
		nonprofit.donationsCount = nonprofit.donationsCount + 1;
		nonprofit.donationsFees = nonprofit.donationsFees + donation.fees;
		nonprofit.donationsFeesCovered = donation.isFeeCovered ? nonprofit.donationsFeesCovered + donation.fees : nonprofit.donationsFeesCovered;
		nonprofit.donationsSubtotal = nonprofit.donationsSubtotal + donation.subtotal;
		nonprofit.donationsTotal = nonprofit.donationsTotal + donation.total;
		return nonprofit.validate();
	}).then(function () {
		return donationsRepository.save(request.urlParam('nonprofit_uuid'), donation);
	}).then(function (response) {
		donation = response;
		return nonprofitsRepository.save(nonprofit);
	}).then(function () {
		callback(null, donation.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};