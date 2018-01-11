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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../.env`});

const _ = require('lodash');
const fuzzy = require('fuzzy');
const DonorsRepository = require('./../src/repositories/donors');
const Generator = require('./../src/helpers/generator');
const inquirer = require('inquirer');
const inquirerAutocomplete = require('inquirer-autocomplete-prompt');
const MessagesRepository = require('./../src/repositories/messages');
const MetricsHelper = require('./../src/helpers/metrics');
const NonprofitsRepository = require('./../src/repositories/nonprofits');
const NonprofitDonationsRepository = require('./../src/repositories/nonprofitDonations');
const NonprofitDonationTiersRepository = require('./../src/repositories/nonprofitDonationTiers');
const NonprofitSlidesRepository = require('./../src/repositories/nonprofitSlides');
const PaymentTransactionsRepository = require('./../src/repositories/paymentTransactions');

/**
 * Seed Donations
 *
 * @return {Promise}
 */
const seedDonations = function () {
	const generator = new Generator();
	const donorsRepository = new DonorsRepository();
	const nonprofitDonationsRepository = new NonprofitDonationsRepository();
	const nonprofitsRepository = new NonprofitsRepository();
	const paymentTransactionsRepository = new PaymentTransactionsRepository();

	return nonprofitsRepository.getAll().then(function (results) {
		if (!results || results.length === 0) {
			return Promise.reject(new Error('No nonprofits found in stack: ' + process.env.AWS_STACK_NAME));
		}
		const options = _.map(results, function (nonprofit) {
			return {name: nonprofit.legalName, value: nonprofit}
		});
		return inquirer.prompt([
			{
				type: 'list',
				message: 'Select a nonprofit:',
				name: 'nonprofit',
				choices: options
			},
			{
				type: 'input',
				message: 'How many donations would you like to seed:',
				name: 'count',
				default: '10'
			}
		]);
	}).then(function (answers) {
		const count = parseInt(answers.count);
		const chunkSize = Math.floor(Math.random() * 3) + 1;

		const donations = _.chunk(generator.modelCollection('donation', count), chunkSize);
		const donors = generator.modelCollection('donor', donations.length);
		const paymentTransactions = generator.modelCollection('paymentTransaction', donations.length);

		let nonprofitDonations = [];
		let donationsFees = 0, donationsFeesCovered = 0, donationsSubtotal = 0, donationsTotal = 0, topDonation = 0;
		donations.forEach(function (chunk, i) {
			let paymentTotal = 0;
			chunk.forEach(function (donation) {
				donation.donorUuid = donors[i].uuid;
				if (!donation.isAnonymous) {
					donation.donorFirstName = donors[i].firstName;
					donation.donorLastName = donors[i].lastName;
					donation.donorEmail = donors[i].email;
					donation.donorPhone = donors[i].phone;
					donation.donorAddress1 = donors[i].address1;
					donation.donorAddress2 = donors[i].address2;
					donation.donorCity = donors[i].city;
					donation.donorState = donors[i].state;
					donation.donorZip = donors[i].zip;
				}

				donation.nonprofitUuid = answers.nonprofit.uuid;
				donation.nonprofitLegalName = answers.nonprofit.legalName;

				donation.paymentTransactionUuid = paymentTransactions[i].uuid;
				if (!donation.isOfflineDonation) {
					donation.creditCardName = paymentTransactions[i].creditCardName;
					donation.creditCardType = paymentTransactions[i].creditCardType;
					donation.creditCardLast4 = paymentTransactions[i].creditCardLast4;
					donation.creditCardExpirationMonth = paymentTransactions[i].creditCardExpirationMonth;
					donation.creditCardExpirationYear = paymentTransactions[i].creditCardExpirationYear;
					donation.creditCardZip = paymentTransactions[i].billingZip;
					donation.paymentTransactionId = paymentTransactions[i].transactionId;
					donation.paymentTransactionAmount = paymentTransactions[i].transactionAmountInCents;
					donation.paymentTransactionIsTestMode = paymentTransactions[i].isTestMode;
					donation.paymentTransactionStatus = paymentTransactions[i].transactionStatus;
				}

				donationsFees += donation.fees;
				donationsFeesCovered = donation.isFeeCovered ? donationsFeesCovered + donation.fees : donationsFeesCovered;
				donationsSubtotal += donation.subtotal;
				donationsTotal += donation.total;
				paymentTotal += donation.total;
				topDonation = donation.subtotal > topDonation ? donation.subtotal : topDonation;
			});
			paymentTransactions[i].total = paymentTotal;
			nonprofitDonations = nonprofitDonations.concat(chunk);
		});
		return donorsRepository.batchUpdate(donors).then(function () {
			return nonprofitDonationsRepository.batchUpdate(nonprofitDonations);
		}).then(function () {
			return paymentTransactionsRepository.batchUpdate(paymentTransactions);
		}).then(function () {
			return MetricsHelper.addAmountToMetric('DONORS_COUNT', donors.length);
		}).then(function () {
			return MetricsHelper.addAmountToMetric('DONATIONS_COUNT', count);
		}).then(function () {
			return MetricsHelper.addAmountToMetric('DONATIONS_TOTAL', donationsSubtotal);
		}).then(function () {
			return MetricsHelper.addAmountToMetric('TOP_DONATION', topDonation);
		}).then(function () {
			return nonprofitsRepository.get(answers.nonprofit.uuid);
		}).then(function (nonprofit) {
			nonprofit.donationsCount = nonprofit.donationsCount += count;
			nonprofit.donationsFees = nonprofit.donationsFees + donationsFees;
			nonprofit.donationsFeesCovered = nonprofit.donationsFeesCovered + donationsFeesCovered;
			nonprofit.donationsSubtotal = nonprofit.donationsSubtotal + donationsSubtotal;
			nonprofit.donationsTotal = nonprofit.donationsTotal + donationsTotal;
			return nonprofitsRepository.save(nonprofit);
		});
	}).then(function () {
		console.log('seeded donations');
	});
};

/**
 * Seed Messages
 *
 * @return {Promise}
 */
const seedMessages = function () {
	const generator = new Generator();
	const messagesRepository = new MessagesRepository();

	return inquirer.prompt([
		{
			type: 'input',
			message: 'How many nonprofits would you like to seed:',
			name: 'count',
			default: '10'
		}
	]).then(function (answers) {
		const count = parseInt(answers.count);
		const messages = generator.modelCollection('message', count);
		return messagesRepository.batchUpdate(messages);
	}).then(function () {
		console.log('seeded messages');
	});
};

/**
 * Seed Nonprofits
 *
 * @return {Promise}
 */
const seedNonprofits = function () {
	const generator = new Generator();
	const nonprofitsRepository = new NonprofitsRepository();
	const nonprofitDonationTiersRepository = new NonprofitDonationTiersRepository();
	const nonprofitSlidesRepository = new NonprofitSlidesRepository();

	const nonprofitSlides = [];
	const nonprofitDonationTiers = [];
	return inquirer.prompt([
		{
			type: 'input',
			message: 'How many nonprofits would you like to seed:',
			name: 'count',
			default: '10'
		}
	]).then(function (answers) {
		const count = parseInt(answers.count);
		const nonprofits = generator.modelCollection('nonprofit', count, {donationsCount: 0, donationsFees: 0, donationsFeesCovered: 0, donationsSubtotal: 0, donationsTotal: 0});

		_.each(nonprofits, function (nonprofit) {
			const slideCount = Math.floor(Math.random() * 8) + 1;
			const slides = generator.modelCollection('nonprofitSlide', slideCount, {nonprofitUuid: nonprofit.uuid, type: 'IMAGE', fileUuid: null});
			_.each(slides, function (slide, i) {
				slide.sortOrder = i;
				nonprofitSlides.push(slide);
			});
		});

		_.each(nonprofits, function (nonprofit) {
			const tiers = generator.modelCollection('nonprofitDonationTier', 4, {nonprofitUuid: nonprofit.uuid});
			tiers.forEach(function (tier) {
				nonprofitDonationTiers.push(tier);
			});
		});

		return nonprofitsRepository.batchUpdate(nonprofits);
	}).then(function () {
		return nonprofitSlidesRepository.batchUpdate(nonprofitSlides);
	}).then(function () {
		return nonprofitDonationTiersRepository.batchUpdate(nonprofitDonationTiers);
	}).then(function () {
		console.log('seeded nonprofits');
	});
};

/**
 * Filter through available seeders
 *
 * @param answers
 * @param input
 * @return {Promise}
 */
const seedersSource = function (answers, input) {
	input = input || '';
	return new Promise(function (resolve) {
		const seeders = [
			'donations',
			'messages',
			'nonprofits'
		];
		const results = fuzzy.filter(input, seeders);
		resolve(results.map(function (el) {
			return el.original;
		}));
	});
};

/**
 * Run the script
 */
inquirer.registerPrompt('autocomplete', inquirerAutocomplete);
inquirer.prompt([
	{
		type: 'autocomplete',
		message: 'Select a seeder to run:',
		name: 'seeder',
		source: seedersSource
	}
]).then(function (answer) {
	switch (answer.seeder) {
		case 'donations':
			return seedDonations();
		case 'messages':
			return seedMessages();
		case 'nonprofits':
			return seedNonprofits();
		default:
			return Promise.reject(new Error('Invalid seeder: ' + answer.seeder));
	}
}).catch(function (err) {
	console.log(err);
});