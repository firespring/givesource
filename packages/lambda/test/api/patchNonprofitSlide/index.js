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
const PatchNonprofitSlide = require('../../../src/api/patchNonprofitSlide/index');
const NonprofitsRepository = require('../../../src/repositories/nonprofits');
const NonprofitSlidesRepository = require('../../../src/repositories/nonprofitSlides');
const TestHelper = require('../../helpers/test');

describe('PatchNonprofitSlide', function () {

	afterEach(function () {
		NonprofitsRepository.prototype.get.restore();
		NonprofitSlidesRepository.prototype.get.restore();
		NonprofitSlidesRepository.prototype.save.restore();
	});

	it('should return an updated nonprofit slide', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const original = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
		const updated = TestHelper.generate.model('slide', {uuid: original.uuid, nonprofitUuid: nonprofit.uuid});
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit);
		sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(original);
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except('uuid'),
			params: {
				nonprofitUuid: nonprofit.uuid,
				slideUuid: original.uuid
			}
		};
		return PatchNonprofitSlide.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const original = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
		const params = {
			params: {
				nonprofitUuid: nonprofit.uuid,
				slideUuid: original.uuid
			}
		};
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit);
		sinon.stub(NonprofitSlidesRepository.prototype, 'get').rejects('Error');
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').resolves(original);
		return PatchNonprofitSlide.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const original = TestHelper.generate.model('slide', {nonprofitUuid: nonprofit.uuid});
		const params = {
			params: {
				nonprofitUuid: nonprofit.uuid,
				slideUuid: original.uuid
			}
		};
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit);
		sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(original);
		sinon.stub(NonprofitSlidesRepository.prototype, 'save').rejects('Error');
		return PatchNonprofitSlide.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});