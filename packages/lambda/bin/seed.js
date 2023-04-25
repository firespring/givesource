/*
 * Copyright 2019 Firespring, Inc.
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
const Generator = require('../src/helpers/generator');
const inquirer = require('inquirer');
const inquirerAutocomplete = require('inquirer-autocomplete-prompt');
const MessagesRepository = require('../src/repositories/messages');
const NonprofitsRepository = require('../src/repositories/nonprofits');
const NonprofitDonationsRepository = require('../src/repositories/donations');
const NonprofitDonationTiersRepository = require('../src/repositories/nonprofitDonationTiers');
const NonprofitSlidesRepository = require('../src/repositories/nonprofitSlides');
const DonorsRepository = require('../src/repositories/donors');
const PaymentTransactionRepository = require('../src/repositories/paymentTransactions');

/**
 * Seed Donations
 *
 * @return {Promise}
 */
const seedDonations = function () {
  const generator = new Generator();
  const nonprofitDonationsRepository = new NonprofitDonationsRepository();
  const nonprofitsRepository = new NonprofitsRepository();
  const donorsRepository = new DonorsRepository();
  const paymentTransactionRepository = new PaymentTransactionRepository();

  let donors = [];
  let savedDonors = [];
  let paymentTransactions = [];
  let savedPts = [];
  let donations = [];
  let promptAnswers;
  return nonprofitsRepository.getAll().then(function (results) {
    if (!results || results.length === 0) {
      return Promise.reject(new Error('No nonprofits found in stack: ' + config.get('stack.AWS_STACK_NAME')));
    }
    const options = _.map(results, function (nonprofit) {
      return { name: nonprofit.legalName, value: nonprofit };
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
    promptAnswers = answers;
    const count = parseInt(promptAnswers.count);
    return generator.modelCollection('Donation', count, { paymentTransactionIsTestMode: 1 });
  }).then(function (generatedDonations) {
    const chunkSize = Math.floor(Math.random() * 3) + 1;
    donations = _.chunk(generatedDonations, chunkSize);
    return generator.modelCollection('Donor', donations.length);
  }).then(function (generatedDonors) {
    donors = generatedDonors;
    return generator.modelCollection('PaymentTransaction', donations.length, { isTestMode: true });
  }).then(function (generatedPTs) {
    paymentTransactions = generatedPTs;
    let promise = Promise.resolve();
    donors.forEach(function (donor) {
      promise = promise.then(function () {
        return donorsRepository.upsert(donor, {});
      }).then(function (popDonors) {
        savedDonors.push(popDonors);
        return popDonors;
      });
    });
    return promise;
  }).then(function (popDonors) {
    donors = popDonors;
    let promise = Promise.resolve();
    paymentTransactions.forEach(function (paymentTransaction) {
      promise = promise.then(function () {
        return paymentTransactionRepository.upsert(paymentTransaction, {});
      }).then(function (popPT) {
        savedPts.push(popPT);
        return popPT;
      });
    });
    return promise;
  }).then(function (pts) {
    paymentTransactions = pts;
    let nonprofitDonations = [];
    let donationsFees = 0, donationsFeesCovered = 0, donationsSubtotal = 0, donationsTotal = 0, topDonation = 0;
    donations.forEach(function (chunk, i) {
      let paymentTotal = 0;
      const donor = _.filter(savedDonors, function (object, key) {
        return key == i;
      })[0];
      const pt = _.filter(savedPts, function (object, key) {
        return key == i;
      })[0];
      chunk.forEach(function (donation) {
        donation.donorId = donor.id;
        donation.nonprofitId = promptAnswers.nonprofit.id;

        donation.paymentTransactionId = pt.id;
        if (!donation.isOfflineDonation) {
          donation.paymentTransactionId = pt.transactionId;
          donation.paymentTransactionIsTestMode = pt.isTestMode ? 1 : 0;
        }

        donationsFees += donation.fees;
        donationsFeesCovered = donation.isFeeCovered ? donationsFeesCovered + donation.fees : donationsFeesCovered;
        donationsSubtotal += donation.subtotal;
        donationsTotal += donation.total;
        paymentTotal += donation.total;
        topDonation = donation.subtotal > topDonation ? donation.subtotal : topDonation;
      });
      pt.total = paymentTotal;
      nonprofitDonations = nonprofitDonations.concat(chunk);
    });
    let promise = Promise.resolve(nonprofitDonations)
    nonprofitDonations.forEach(function (nonprofitDonation) {
      promise = promise.then(function () {
        return nonprofitDonationsRepository.upsert(nonprofitDonation, {});
      }).then(function (popNp) {
        return popNp;
      });
    });
    return promise;
  }).then(function () {
    console.log('seeded donations')
  });
}

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
    return generator.modelCollection('Message', count);
  }).then(function (messages) {
		let promise = Promise.resolve();
		messages.forEach(function (message) {
      promise = promise.then(function () {
        return messagesRepository.upsert(message, {});
      }).then(function (popMessage) {
        return popMessage;
      });
    });
		return promise;
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
    return generator.modelCollection('Nonprofit', count, { status: 'ACTIVE' });
  }).then(function (nonprofits) {
    let promise = Promise.resolve()
    nonprofits.forEach(function (nonprofit) {
      promise = promise.then(function () {
        return nonprofitsRepository.upsert(nonprofit, {})
      }).then(function (popNp) {
        return popNp;
      });
    });
    return promise
	}).then(function (nonprofits) {
    let promise = Promise.resolve()
    nonprofits.forEach(function (nonprofit) {
      promise = promise.then(function () {
        const slideCount = Math.floor(Math.random() * 8) + 1
        return generator.modelCollection('NonprofitSlide', slideCount, {
          nonprofitId: nonprofit.id,
          type: 'IMAGE',
          fileId: 0
        });
      }).then(function (slides) {
        _.each(slides, function (slide, i) {
          slide.sortOrder = i;
          slide.url = slide.url + '?random=' + i;
          nonprofitSlides.push(slide);
        });
        return generator.modelCollection('NonprofitDonationTier', 4, { nonprofitId: nonprofit.id });
      }).then(function (tiers) {
        tiers.forEach(function (tier) {
          nonprofitDonationTiers.push(tier);
        });
      });
    });
    return promise;
  }).then(function () {
    let promise = Promise.resolve();
    nonprofitSlides.forEach(function (slide) {
      promise = promise.then(function () {
        return nonprofitSlidesRepository.upsert(slide, {});
      });
    });
    return promise;
	}).then(function () {
    let promise = Promise.resolve()
    nonprofitDonationTiers.forEach(function (tier) {
      promise = promise.then(function () {
        return nonprofitDonationTiersRepository.upsert(tier, {});
      });
    });
    return promise;
	}).finally(function () {
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
