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
const PatchNonprofit = require('../../../src/api/patchNonprofit/index');
const NonprofitsRepository = require('../../../src/repositories/nonprofits');
const TestHelper = require('../../helpers/test');

describe('PatchNonprofit', function () {

	afterEach(function () {
		NonprofitsRepository.prototype.get.restore();
		NonprofitsRepository.prototype.save.restore();
		NonprofitsRepository.prototype.generateUniqueSlug.restore();
	});

	it('should return an updated nonprofit', function () {
		const original = TestHelper.generate.model('nonprofit');
		const updated = TestHelper.generate.model('nonprofit', {uuid: original.uuid});
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(original);
		sinon.stub(NonprofitsRepository.prototype, 'save').resolves(updated);
		sinon.stub(NonprofitsRepository.prototype, 'generateUniqueSlug').resolves();
		const params = {
			body: updated.except('uuid'),
			params: {
				nonprofitUuid: original.uuid
			}
		};
		return PatchNonprofit.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const original = TestHelper.generate.model('nonprofit');
		const params = {
			params: {
				nonprofitUuid: original.uuid
			}
		};
		sinon.stub(NonprofitsRepository.prototype, 'get').rejects('Error');
		sinon.stub(NonprofitsRepository.prototype, 'save').resolves(original);
		sinon.stub(NonprofitsRepository.prototype, 'generateUniqueSlug').resolves();
		return PatchNonprofit.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const original = TestHelper.generate.model('nonprofit');
		const params = {
			params: {
				nonprofitUuid: original.uuid
			}
		};
		sinon.stub(NonprofitsRepository.prototype, 'get').resolves(original);
		sinon.stub(NonprofitsRepository.prototype, 'save').rejects('Error');
		sinon.stub(NonprofitsRepository.prototype, 'generateUniqueSlug').resolves();
		return PatchNonprofit.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});