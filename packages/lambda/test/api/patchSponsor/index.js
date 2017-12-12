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
const PatchSponsor = require('./../../../src/api/patchSponsor/index');
const sinon = require('sinon');
const SponsorsRepository = require('./../../../src/repositories/sponsors');
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers');
const TestHelper = require('./../../helpers/test');

describe('PatchSponsor', function () {

	afterEach(function () {
		SponsorTiersRepository.prototype.get.restore();
		SponsorsRepository.prototype.get.restore();
		SponsorsRepository.prototype.save.restore();
	});

	it('should return an updated sponsor', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const original = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
		const updated = TestHelper.generate.model('sponsor', {uuid: original.uuid, sponsorTierUuid: sponsorTier.uuid});
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'get').resolves(original);
		sinon.stub(SponsorsRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except('uuid'),
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
				sponsor_uuid: original.uuid
			}
		};
		return PatchSponsor.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const original = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
		const params = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
				sponsor_uuid: original.uuid
			}
		};
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'get').rejects('Error');
		sinon.stub(SponsorsRepository.prototype, 'save').resolves(original);
		return PatchSponsor.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const original = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
		const params = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
				sponsor_uuid: original.uuid
			}
		};
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'get').resolves(original);
		sinon.stub(SponsorsRepository.prototype, 'save').rejects('Error');
		return PatchSponsor.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});