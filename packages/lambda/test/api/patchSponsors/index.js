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
const PatchSponsors = require('./../../../src/api/patchSponsors/index');
const sinon = require('sinon');
const SponsorsRepository = require('./../../../src/repositories/sponsors');
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers');
const TestHelper = require('./../../helpers/test');

describe('PatchSponsors', function () {

	afterEach(function () {
		SponsorTiersRepository.prototype.get.restore();
		SponsorsRepository.prototype.batchSave.restore();
	});

	it('should return an updated sponsor', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const models = TestHelper.generate.modelCollection('sponsor', 3, {sponsorTierUuid: sponsorTier.uuid});
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'batchSave').resolves();
		const params = {
			body: {
				sponsors: models.map(function (model) {
					return model.all()
				}),
			},
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
			}
		};
		return PatchSponsors.handle(params, null, function (error) {
			assert(error === undefined);
		});
	});

	it('should return error on exception thrown - batchSave', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const models = TestHelper.generate.modelCollection('sponsor', 3, {sponsorTierUuid: sponsorTier.uuid});
		const params = {
			body: {
				sponsors: models.map(function (model) {
					return model.all()
				}),
			},
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
			}
		};
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'batchSave').rejects('Error');
		return PatchSponsors.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});