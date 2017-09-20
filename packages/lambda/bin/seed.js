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

const commander = require('commander');
const Generator = require('../test/helpers/test').generate;
const DonorsRepository = require('../src/repositories/donors');
const MessagesRepository = require('../src/repositories/messages');
const NonprofitsRepository = require('../src/repositories/nonprofits');
const NonprofitDonationsRepository = require('../src/repositories/nonprofitDonations');
const NonprofitSlidesRepository = require('../src/repositories/nonprofitSlides');
const PaymentTransactionsRepository = require('../src/repositories/paymentTransactions');
const ReportsRepository = require('../src/repositories/reports');
const UsersRepository = require('../src/repositories/users');

const types = {
	donation: {
		data: [],
		repository: new NonprofitDonationsRepository()
	},
	donor: {
		data: [],
		repository: new DonorsRepository()
	},
	message: {
		data: [],
		repository: new MessagesRepository()
	},
	nonprofit: {
		data: [],
		repository: new NonprofitsRepository()
	},
	paymentTransaction: {
		data: [],
		repository: new PaymentTransactionsRepository()
	},
	report: {
		data: [],
		repository: new ReportsRepository()
	},
	slide: {
		data: [],
		repository: new NonprofitSlidesRepository()
	},
	user: {
		data: [],
		repository: new UsersRepository()
	}
};

const seed = function () {
	Object.keys(types).forEach(function (type) {
		if (types[type].data.length) {
			types[type].repository.batchUpdate(types[type].data).then(function () {
				console.log(`seeded ${type}s`);
			}).catch(function (err) {
				console.log(err);
			});
		}
	});
};

const generate = function (count, relatedCount) {
	count = count > 0 ? count : 10;
	relatedCount = relatedCount > 0 ? relatedCount : 10;

	types.donor.data = Generator.modelCollection('donor', count);
	types.message.data = Generator.modelCollection('message', count);
	types.nonprofit.data = Generator.modelCollection('nonprofit', count);
	types.paymentTransaction.data = Generator.modelCollection('paymentTransaction', count);
	types.report.data = Generator.modelCollection('report', count);
	types.user.data = Generator.modelCollection('user', count);
	for (let i = 0; i < count; i++) {
		Generator.modelCollection('donation', relatedCount, {donorUuid: types.donor.data[i].uuid, nonprofitUuid: types.nonprofit.data[i].uuid, paymentTransactionUuid: types.paymentTransaction.data[i].uuid}).forEach(function (donation) {
			types.donation.data.push(donation);
		});
		Generator.modelCollection('slide', relatedCount, {nonprofitUuid: types.nonprofit.data[i].uuid}).forEach(function (slide) {
			types.slide.data.push(slide);
		});
	}
};

commander
	.option('-c, --count <count>', 'Number of models to create', 'count')
	.option('-r, --relatedCount <relatedCount>', 'Number of related models to create', 'relatedCount')
	.parse(process.argv);

generate(commander.count, commander.relatedCount);
seed();