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
const GetSponsors = require('./../../../src/api/getSponsors/index');
const sinon = require('sinon');
const SponsorsRepository = require('./../../../src/repositories/sponsors');
const TestHelper = require('./../../helpers/test');

describe('GetSponsors', function () {

	afterEach(function () {
		SponsorsRepository.prototype.getAll.restore();
	});

	it('should return a list of nonprofit slides', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const models = TestHelper.generate.modelCollection('sponsor', 3, {sponsorTierUuid: sponsorTier.uuid});
		sinon.stub(SponsorsRepository.prototype, 'getAll').resolves(models);
		const params = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid
			}
		};
		return GetSponsors.handle(params, null, function (error, results) {
			assert(error === null);
			assert(results.length === 3);
			results.forEach(function (result, i) {
				assert(result.uuid === models[i].uuid);
			});
		});
	});

	it('should return error on exception thrown', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		sinon.stub(SponsorsRepository.prototype, 'getAll').rejects('Error');
		const params = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid
			}
		};
		return GetSponsors.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});