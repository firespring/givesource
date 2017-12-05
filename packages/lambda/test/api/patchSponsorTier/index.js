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
const PatchSponsorTier = require('../../../src/api/patchSponsorTier/index');
const sinon = require('sinon');
const SponsorTiersRepository = require('../../../src/repositories/sponsorTiers');
const TestHelper = require('../../helpers/test');

describe('PatchSponsorTier', function () {

	afterEach(function () {
		SponsorTiersRepository.prototype.get.restore();
		SponsorTiersRepository.prototype.save.restore();
	});

	it('should return an updated sponsor tier', function () {
		const original = TestHelper.generate.model('sponsorTier');
		const updated = TestHelper.generate.model('sponsorTier', {uuid: original.uuid});
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(original);
		sinon.stub(SponsorTiersRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except('uuid'),
			params: {
				sponsor_tier_uuid: original.uuid
			}
		};
		return PatchSponsorTier.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const original = TestHelper.generate.model('sponsorTier');
		const params = {
			params: {
				sponsor_tier_uuid: original.uuid
			}
		};
		sinon.stub(SponsorTiersRepository.prototype, 'get').rejects('Error');
		sinon.stub(SponsorTiersRepository.prototype, 'save').resolves(original);
		return PatchSponsorTier.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const original = TestHelper.generate.model('sponsorTier');
		const params = {
			params: {
				sponsor_tier_uuid: original.uuid
			}
		};
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(original);
		sinon.stub(SponsorTiersRepository.prototype, 'save').rejects('Error');
		return PatchSponsorTier.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});