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