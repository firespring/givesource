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
const NonprofitDonationsRepository = require('../src/repositories/nonprofitDonations');
const PaymentTransactionsRepository = require('../src/repositories/paymentTransactions');

const types = {
	donation: {
		data: [],
		repository: new NonprofitDonationsRepository()
	},
	paymentTransaction: {
		data: [],
		repository: new PaymentTransactionsRepository()
	},
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

const generate = function (uuid, count) {
	count = count > 0 ? count : 10;

	if (!uuid) {
		console.error('Error: missing required parameter: --uuid');
	}

	types.paymentTransaction.data = Generator.modelCollection('paymentTransaction', count);
	Generator.modelCollection('donation', count, {nonprofitUuid: uuid}).forEach(function (donation, i) {
		donation.paymentTransactionUuid = types.paymentTransaction.data[i].uuid;
		types.donation.data.push(donation);
	});
};

commander
	.option('-c, --count <count>', 'Number of donations to seed', 'count')
	.option('-u, --uuid <uuid>', 'Nonprofit uuid', 'uuid')
	.parse(process.argv);

generate(commander.uuid, commander.count);
seed();