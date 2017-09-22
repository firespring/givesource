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
const DonorsRepository = require('../src/repositories/donors');
const Generator = require('../test/helpers/test').generate;
const inquirer = require('inquirer');
const inquirerAutocomplete = require('inquirer-autocomplete-prompt');
const MessagesRepository = require('../src/repositories/messages');
const NonprofitsRepository = require('../src/repositories/nonprofits');
const NonprofitDonationsRepository = require('../src/repositories/nonprofitDonations');
const NonprofitSlidesRepository = require('../src/repositories/nonprofitSlides');
const PaymentTransactionsRepository = require('../src/repositories/paymentTransactions');

/**
 * Seed Donations
 *
 * @return {Promise}
 */
const seedDonations = function () {
	const donorsRepository = new DonorsRepository();
	const donationsRepository = new NonprofitDonationsRepository();
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
		const chunkSize = Math.floor(Math.random() * count) + 1;

		const donations = _.chunk(Generator.modelCollection('donation', count), chunkSize);
		const donors = Generator.modelCollection('donor', donations.length);
		const paymentTransactions = Generator.modelCollection('paymentTransaction', donations.length);

		return donorsRepository.batchUpdate(donors).then(function () {
			paymentTransactionsRepository.batchUpdate(paymentTransactions);
		}).then(function () {
			let promise = Promise.resolve();
			_.each(donations, function (chunk, i) {
				_.each(chunk, function (donation) {
					donation.donorUuid = donors[i].uuid;
					donation.paymentTransactionUuid = paymentTransactions[i].uuid;
					donation.nonprofitUuid = answers.nonprofitUuid;
				});

				promise = promise.then(function () {
					return donationsRepository.batchUpdate(chunk);
				});
			});
			return promise;
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
		const messages = Generator.modelCollection('message', count);
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
	const nonprofitsRepository = new NonprofitsRepository();
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
		const nonprofits = Generator.modelCollection('nonprofit', count);

		let promise = nonprofitsRepository.batchUpdate(nonprofits);
		_.each(nonprofits, function (nonprofit) {
			const slideCount = Math.floor(Math.random() * 8) + 1;
			const slides = Generator.modelCollection('slide', slideCount, { nonprofitUuid: nonprofit.uuid });
			_.each(slides, function (slide, i) {
				slide.sortOrder = i;
			});
			promise = promise.then(function () {
				return nonprofitSlidesRepository.batchUpdate(slides);
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