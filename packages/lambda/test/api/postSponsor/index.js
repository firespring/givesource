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
const HttpException = require('./../../../src/exceptions/http');
const PostSponsor = require('./../../../src/api/postNonprofitSlide/index');
const sinon = require('sinon');
const SponsorsRepository = require('./../../../src/repositories/sponsors');
const SponsorTiersRepository = require('./../../../src/repositories/sponsorTiers');
const TestHelper = require('./../../helpers/test');

describe('PostSponsor', function () {

	afterEach(function () {
		SponsorTiersRepository.prototype.get.restore();
		SponsorsRepository.prototype.getCount.restore();
		SponsorsRepository.prototype.save.restore();
	});

	it('should return a sponsor', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		const model = TestHelper.generate.model('sponsor', {sponsorTierUuid: sponsorTier.uuid});
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'getCount').resolves(1);
		sinon.stub(SponsorsRepository.prototype, 'save').resolves(model);
		const params = {
			body: model.except(['uuid', 'createdOn']),
			params: {
				sponsor_tier_uuid: sponsorTier.uuid
			}
		};
		return PostSponsor.handle(params, null, function (error, result) {
			assert(error === null);
			TestHelper.assertModelEquals(result, model, ['uuid', 'createdOn']);
		});
	});

	it('should return error on exception thrown', function () {
		const sponsorTier = TestHelper.generate.model('sponsorTier');
		sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier);
		sinon.stub(SponsorsRepository.prototype, 'getCount').resolves(1);
		sinon.stub(SponsorsRepository.prototype, 'save').rejects('Error');
		return PostSponsor.handle({}, null, function (error) {
			assert(error instanceof HttpException);
		});
	});

});