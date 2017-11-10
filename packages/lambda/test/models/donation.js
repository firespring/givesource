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

const assert = require('assert');
const Donation = require('../../src/models/donation');
const Model = require('../../src/models/model');
const TestHelper = require('../helpers/test');

describe('Donation', function () {

	describe('#construct()', function () {

		it('should be an instance of Model', function () {
			const model = new Donation();
			assert.ok(model instanceof Model);
		});

		it('should be an instance of Donation', function () {
			const model = new Donation();
			assert.ok(model instanceof Donation);
		});

	});

	describe('#populate()', function () {

		it('should generate isFeeCovered', function () {
			const model = new Donation();
			assert.equal(model.isFeeCovered, false);
		});

		it('should generate isOfflineDonation', function () {
			const model = new Donation();
			assert.equal(model.isOfflineDonation, false);
		});

		it('should only allow defined attributes', function () {
			const model = new Donation({test1: 123, test2: 'test', test3: true});
			assert.equal(model.test1, undefined);
			assert.equal(model.test2, undefined);
			assert.equal(model.test3, undefined);
		});

	});

	describe('#validate()', function () {
		const tests = [
			{model: TestHelper.generate.model('donation'), param: 'uuid', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'uuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('donation'), param: 'uuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('donation'), param: 'createdOn', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'createdOn', value: 'test', error: true},
			{model: TestHelper.generate.model('donation'), param: 'createdOn', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'createdOn', value: 123456, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isDeleted', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'isDeleted', value: 'test', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isDeleted', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isDeleted', value: 123456, error: true},
			{model: TestHelper.generate.model('donation'), param: 'isDeleted', value: 0, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isDeleted', value: 1, error: false},
			{model: TestHelper.generate.model('donation'), param: 'amountInCents', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'amountInCents', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'amountInCents', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'amountInCents', value: 123456, error: false},
			{model: TestHelper.generate.model('donation'), param: 'donorUuid', value: null, error: false},
			{model: TestHelper.generate.model('donation'), param: 'donorUuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('donation'), param: 'donorUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('donation'), param: 'feesInCents', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'feesInCents', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'feesInCents', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'feesInCents', value: 123456, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isAnonymous', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'isAnonymous', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isAnonymous', value: 'test', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isAnonymous', value: 123456, error: true},
			{model: TestHelper.generate.model('donation'), param: 'isAnonymous', value: true, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isFeeCovered', value: null, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isFeeCovered', value: '', error: false},
			{model: TestHelper.generate.model('donation'), param: 'isFeeCovered', value: 'test', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isFeeCovered', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isFeeCovered', value: 123456, error: true},
			{model: TestHelper.generate.model('donation'), param: 'isFeeCovered', value: true, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isOfflineDonation', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'isOfflineDonation', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isOfflineDonation', value: 'test', error: true},
			{model: TestHelper.generate.model('donation'), param: 'isOfflineDonation', value: 123456, error: true},
			{model: TestHelper.generate.model('donation', {paymentTransactionUuid: '9ba33b63-41f9-4efc-8869-2b50a35b53df'}), param: 'isOfflineDonation', value: false, error: false},
			{model: TestHelper.generate.model('donation'), param: 'isOfflineDonation', value: true, error: false},
			{model: TestHelper.generate.model('donation'), param: 'nonprofitUuid', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'nonprofitUuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('donation'), param: 'nonprofitUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('donation', {isOfflineDonation: false}), param: 'paymentTransactionUuid', value: null, error: true},
			{model: TestHelper.generate.model('donation', {isOfflineDonation: false}), param: 'paymentTransactionUuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('donation', {isOfflineDonation: false}), param: 'paymentTransactionUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('donation'), param: 'totalInCents', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'totalInCents', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'totalInCents', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'totalInCents', value: 123456, error: false},
		];
		TestHelper.validate(tests);
	});

});