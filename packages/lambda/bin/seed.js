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
			return {name: nonprofit.legalName, value: nonprofit.uuid}
		});
		return inquirer.prompt([
			{
				type: 'list',
				message: 'Select a nonprofit:',
				name: 'nonprofitUuid',
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

		let donationsTotal = 0;
		return donorsRepository.batchUpdate(donors).then(function (response) {
			let promise = Promise.resolve();
			_.each(donations, function (chunk, i) {
				let total = 0;
				_.each(chunk, function (donation) {
					donation.donorUuid = donors[i].uuid;
					donation.paymentTransactionUuid = paymentTransactions[i].uuid;
					donation.nonprofitUuid = answers.nonprofitUuid;
					total += donation.totalInCents;
				});

				paymentTransactions[i].total = total;
				donationsTotal += total;
				promise = promise.then(function () {
					return nonprofitDonationsRepository.batchUpdate(chunk);
				});
			});
			return promise;
		}).then(function () {
			return paymentTransactionsRepository.batchUpdate(paymentTransactions);
		}).then(function () {
			return nonprofitsRepository.get(answers.nonprofitUuid);
		}).then(function (nonprofit) {
			nonprofit.donationsSum = nonprofit.donationsSum += donationsTotal;
			nonprofit.donationsCount = nonprofit.donationsCount += count;
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

	return inquirer.prompt([
		{
			type: 'input',
			message: 'How many nonprofits would you like to seed:',
			name: 'count',
			default: '10'
		}
	]).then(function (answers) {
		const count = parseInt(answers.count);
		const nonprofits = generator.modelCollection('nonprofit', count, {donationsSum: 0, donationsCount: 0});

		let promise = nonprofitsRepository.batchUpdate(nonprofits);
		_.each(nonprofits, function (nonprofit) {
			const slideCount = Math.floor(Math.random() * 8) + 1;
			const slides = generator.modelCollection('nonprofitSlide', slideCount, {nonprofitUuid: nonprofit.uuid, type: 'IMAGE', fileUuid: null});
			_.each(slides, function (slide, i) {
				slide.sortOrder = i;
			});
			promise = promise.then(function () {
				return nonprofitSlidesRepository.batchUpdate(slides);
			});
		});

		_.each(nonprofits, function (nonprofit) {
			const tiers = generator.modelCollection('nonprofitDonationTier', 4, {nonprofitUuid: nonprofit.uuid});
			promise = promise.then(function () {
				return nonprofitDonationTiersRepository.batchUpdate(tiers);
			});
		});

		return promise;
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