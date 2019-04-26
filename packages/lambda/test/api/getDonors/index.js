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
const sinon = require('sinon');
const GetDonors = require('../../../src/api/getDonors/index');
const DonorsRepository = require('../../../src/repositories/donors');
const TestHelper = require('../../helpers/test');

describe('GetDonors', function () {

	afterEach(function () {
		DonorsRepository.prototype.getAll.restore();
	});

	it('should return a list of donors', function () {
		const models = TestHelper.generate.modelCollection('donor', 3);
		sinon.stub(DonorsRepository.prototype, 'getAll').resolves(models);
		return GetDonors.handle({}, null, function (error, results) {
			assert(error === null);
			assert(results.length === 3);
			results.forEach(function (result, i) {
				assert(result.uuid === models[i].uuid);
			});
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(DonorsRepository.prototype, 'getAll').rejects('Error');
		return GetDonors.handle({}, null, function (error, results) {
			assert(error instanceof Error);
		});
	});

});