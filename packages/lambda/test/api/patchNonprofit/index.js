/*
 * Copyright 2018 Firespring, Inc.
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