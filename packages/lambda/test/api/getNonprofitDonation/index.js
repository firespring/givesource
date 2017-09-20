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
const sinon = require('sinon');
const GetNonprofitDonation = require('../../../src/api/getNonprofitDonation/index');
const NonprofitDonationsRepository = require('../../../src/repositories/nonprofitDonations');
const TestHelper = require('../../helpers/test');

describe('GetNonprofitDonation', function () {

	afterEach(function () {
		NonprofitDonationsRepository.prototype.get.restore();
	});

	it('should return a donation', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const donation = TestHelper.generate.model('donation', {nonprofitUuid: nonprofit.uuid});
		sinon.stub(NonprofitDonationsRepository.prototype, 'get').resolves(donation);
		const params = {
			params: {
				nonprofitUuid: nonprofit.uuid,
				donationUuid: donation.uuid
			}
		};
		return GetNonprofitDonation.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, donation.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(NonprofitDonationsRepository.prototype, 'get').rejects('Error');
		const params = {
			params: {
				nonprofitUuid: '1234',
				donationUuid: '1234'
			}
		};
		return GetNonprofitDonation.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});