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
const GetNonprofitSlides = require('../../../src/api/getNonprofitSlides/index');
const NonprofitSlidesRepository = require('../../../src/repositories/nonprofitSlides');
const TestHelper = require('../../helpers/test');

describe('GetNonprofitSlides', function () {

	afterEach(function () {
		NonprofitSlidesRepository.prototype.getAll.restore();
	});

	it('should return a list of slides', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		const models = TestHelper.generate.modelCollection('slide', 3, {nonprofitUuid: nonprofit.uuid});
		sinon.stub(NonprofitSlidesRepository.prototype, 'getAll').resolves(models);
		const params = {
			params: {
				nonprofitUuid: nonprofit.uuid
			}
		};
		return GetNonprofitSlides.handle(params, null, function (error, results) {
			assert(error === null);
			assert(results.length === 3);
			results.forEach(function (result, i) {
				assert(result.uuid === models[i].uuid);
			});
		});
	});

	it('should return error on exception thrown', function () {
		const nonprofit = TestHelper.generate.model('nonprofit');
		sinon.stub(NonprofitSlidesRepository.prototype, 'getAll').rejects('Error');
		const params = {
			params: {
				nonprofitUuid: nonprofit.uuid
			}
		};
		return GetNonprofitSlides.handle(params, null, function (error, results) {
			assert(error instanceof Error);
		});
	});

});