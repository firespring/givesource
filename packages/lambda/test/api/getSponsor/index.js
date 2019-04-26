/*
 * Copyright 2019 Firespring, Inc.
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