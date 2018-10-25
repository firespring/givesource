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

const Donation = require('./../../models/donation');
const DonationHelper = require('./../../helpers/donation');
const HttpException = require('./../../exceptions/http');
const Lambda = require('./../../aws/lambda');
const NonprofitDonationsRepository = require('./../../repositories/nonprofitDonations');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

export function handle(event, context, callback) {
	const donationsRepository = new NonprofitDonationsRepository();
	const lambda = new Lambda();
	const nonprofitsRepository = new NonprofitsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let nonprofit = null;
	let donation = new Donation({nonprofitUuid: request.urlParam('nonprofit_uuid')});
	request.validate().then(() => {
		donation.populate(request._body);
		return donation.validate();
	}).then(() => {
		return DonationHelper.getFeeRates(donation.isOfflineDonation);
	}).then((rates) => {
		donation.fees = DonationHelper.calculateFees(donation.isOfflineDonation, donation.isFeeCovered, donation.subtotal, rates.flatRate, rates.percent);
		donation.total = donation.isFeeCovered ? (donation.subtotal + donation.fees) : donation.subtotal;
		donation.amountForNonprofit = donation.total - donation.fees;
	}).then(() => {
		return nonprofitsRepository.get(request.urlParam('nonprofit_uuid'));
	}).then((response) => {
		nonprofit = response;
		nonprofit.donationsCount = nonprofit.donationsCount + (donation.count || 1);
		nonprofit.donationsFees = nonprofit.donationsFees + donation.fees;
		nonprofit.donationsFeesCovered = donation.isFeeCovered ? nonprofit.donationsFeesCovered + donation.fees : nonprofit.donationsFeesCovered;
		nonprofit.donationsSubtotal = nonprofit.donationsSubtotal + donation.subtotal;
		nonprofit.donationsTotal = nonprofit.donationsTotal + donation.total;
		return nonprofit.validate();
	}).then(() => {
		return donationsRepository.save(request.urlParam('nonprofit_uuid'), donation);
	}).then((response) => {
		donation = response;
		return nonprofitsRepository.save(nonprofit);
	}).then(() => {
		const body = {
			amount: donation.count || 1,
			key: 'DONATIONS_COUNT'
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricAddAmount', {body: body});
	}).then(() => {
		const body = {
			amount: donation.subtotal,
			key: 'DONATIONS_TOTAL'
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricAddAmount', {body: body});
	}).then(() => {
		if (donation.type === 'BULK') {
			const body = {
				amount: donation.count || 1,
				key: 'DONORS_COUNT'
			};
			lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricAddAmount', {body: body});
		} else {
			const body = {
				amount: donation.subtotal,
				key: 'TOP_DONATION'
			};
			lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-MetricMaxAmount', {body: body});
		}
	}).then(() => {
		const body = {
			donations: [donation.all()]
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationNotificationEmail', {body: body});
	}).then(() => {
		callback(null, donation.all());
	}).catch((err) => {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};