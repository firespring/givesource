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
const sinon = require('sinon');
const GetDonation = require('../../../src/api/getDonation/index');
const DonationsRepository = require('../../../src/repositories/donations');
const TestHelper = require('../../helpers/test');

describe('GetDonation', function () {

	afterEach(function () {
		DonationsRepository.prototype.get.restore();
	});

	it('should return a donation', function () {
		const model = TestHelper.generate.model('donation');
		sinon.stub(DonationsRepository.prototype, 'get').resolves(model);
		const params = {
			params: {
				donationUuid: model.uuid
			}
		};
		return GetDonation.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, model.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(DonationsRepository.prototype, 'get').rejects('Error');
		const params = {
			params: {
				donationUuid: '1234'
			}
		};
		return GetDonation.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});