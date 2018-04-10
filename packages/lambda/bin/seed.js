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

require('./config/bootstrap').bootstrap();

const _ = require('lodash');
const config = require('config');
const fuzzy = require('fuzzy');
const Generator = require('./../src/helpers/generator');
const inquirer = require('inquirer');
const inquirerAutocomplete = require('inquirer-autocomplete-prompt');
const MessagesRepository = require('./../src/repositories/messages');
const NonprofitsRepository = require('./../src/repositories/nonprofits');
const NonprofitDonationsRepository = require('./../src/repositories/nonprofitDonations');
const NonprofitDonationTiersRepository = require('./../src/repositories/nonprofitDonationTiers');
const NonprofitSlidesRepository = require('./../src/repositories/nonprofitSlides');

/**
 * Seed Donations
 *
 * @return {Promise}
 */
const seedDonations = function () {
	const generator = new Generator();
	const nonprofitDonationsRepository = new NonprofitDonationsRepository();
	const nonprofitsRepository = new NonprofitsRepository();

	return nonprofitsRepository.getAll().then(function (results) {
		if (!results || results.length === 0) {
			return Promise.reject(new Error('No nonprofits found in stack: ' + config.get('stack.AWS_STACK_NAME')));
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

		const donations = _.chunk(generator.modelCollection('donation', count, {paymentTransactionIsTestMode: 1}), chunkSize);
		const donors = generator.modelCollection('donor', donations.length);
		const paymentTransactions = generator.modelCollection('paymentTransaction', donations.length, {isTestMode: true});

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
				donation.nonprofitAddress1 = answers.nonprofit.address1;
				donation.nonprofitAddress2 = answers.nonprofit.address2;
				donation.nonprofitAddress3 = answers.nonprofit.address3;
				donation.nonprofitCity = answers.nonprofit.city;
				donation.nonprofitState = answers.nonprofit.state;
				donation.nonprofitZip = answers.nonprofit.zip;

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
					donation.paymentTransactionIsTestMode = paymentTransactions[i].isTestMode ? 1 : 0;
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
		return nonprofitDonationsRepository.batchUpdate(nonprofitDonations);
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