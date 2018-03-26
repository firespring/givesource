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
			{model: TestHelper.generate.model('donation'), param: 'subtotal', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'subtotal', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'subtotal', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'subtotal', value: 123456, error: false},
			{model: TestHelper.generate.model('donation'), param: 'donorUuid', value: null, error: false},
			{model: TestHelper.generate.model('donation'), param: 'donorUuid', value: '1234567890', error: true},
			{model: TestHelper.generate.model('donation'), param: 'donorUuid', value: '9ba33b63-41f9-4efc-8869-2b50a35b53df', error: false},
			{model: TestHelper.generate.model('donation'), param: 'fees', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'fees', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'fees', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'fees', value: 123456, error: false},
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
			{model: TestHelper.generate.model('donation'), param: 'total', value: null, error: true},
			{model: TestHelper.generate.model('donation'), param: 'total', value: '', error: true},
			{model: TestHelper.generate.model('donation'), param: 'total', value: '123456', error: true},
			{model: TestHelper.generate.model('donation'), param: 'total', value: 123456, error: false},
		];
		TestHelper.validate(tests);
	});

});