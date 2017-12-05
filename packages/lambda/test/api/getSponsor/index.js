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
const GetSponsor = require('./../../../src/api/getSponsor/index');
const sinon = require('sinon');
const SponsorsRepository = require('./../../../src/repositories/sponsors');
const TestHelper = require('./../../helpers/test');

describe('GetSponsor', function () {

	afterEach(function () {
		SponsorsRepository.prototype.get.restore();
	});

	it('should return a sponsor', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const model = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
		sinon.stub(SponsorsRepository.prototype, 'get').resolves(model);
		const params = {
			params: {
				sponsor_tier_uuid: sponsorTier.uuid,
				sponsor_uuid: model.uuid
			}
		};
		return GetSponsor.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, model.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(SponsorsRepository.prototype, 'get').rejects('Error');
		const params = {
			params: {
				sponsor_tier_uuid: '1234',
				sponsor_uuid: '1234'
			}
		};
		return GetSponsor.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});