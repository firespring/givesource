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
const PatchDonation = require('../../../src/api/patchDonation/index');
const DonationsRepository = require('../../../src/repositories/donations');
const TestHelper = require('../../helpers/test');

describe('PatchDonation', function () {

	afterEach(function () {
		DonationsRepository.prototype.get.restore();
		DonationsRepository.prototype.save.restore();
	});

	it('should return an updated donation', function () {
		const original = TestHelper.generate.model('donation');
		const updated = TestHelper.generate.model('donation', {uuid: original.uuid});
		sinon.stub(DonationsRepository.prototype, 'get').resolves(original);
		sinon.stub(DonationsRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except('uuid'),
			params: {
				donationUuid: original.uuid
			}
		};
		return PatchDonation.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const original = TestHelper.generate.model('donation');
		const params = {
			params: {
				donationUuid: original.uuid
			}
		};
		sinon.stub(DonationsRepository.prototype, 'get').rejects('Error');
		sinon.stub(DonationsRepository.prototype, 'save').resolves(original);
		return PatchDonation.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const original = TestHelper.generate.model('donation');
		const params = {
			params: {
				donationUuid: original.uuid
			}
		};
		sinon.stub(DonationsRepository.prototype, 'get').resolves(original);
		sinon.stub(DonationsRepository.prototype, 'save').rejects('Error');
		return PatchDonation.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});