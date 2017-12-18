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
const DeleteSponsors = require('./../../../src/api/deleteSponsors/index');
const sinon = require('sinon');
const SponsorsRepository = require('./../../../src/repositories/sponsors');
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers');
const TestHelper = require('./../../helpers/test');

describe('DeleteSponsors', function () {

	afterEach(function () {
		SponsorTiersRepository.prototype.get.restore();
		SponsorsRepository.prototype.batchRemove.restore();
	});

	it('should delete a sponsor', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const models = TestHelper.generate.modelCollection('sponsor', 3, {sponsorTierUuid: sponsorTier.uuid});
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'batchRemove').resolves();
		const event = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
			},
			body: {
				sponsors: models,
			}
		};
		return DeleteSponsors.handle(event, null, function (error, result) {
			assert(error === undefined);
			assert(result === undefined);
		});
	});

	it('should return error on exception thrown', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'batchRemove').rejects('Error');
		const event = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
			},
			body: {
				sponsors: [],
			}
		};
		return DeleteSponsors.handle(event, null, function (error) {
			assert(error instanceof Error);
		});
	});

});