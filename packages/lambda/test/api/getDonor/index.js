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
const GetDonor = require('../../../src/api/getDonor/index');
const DonorsRepository = require('../../../src/repositories/donors');
const TestHelper = require('../../helpers/test');

describe('GetDonor', function () {

	afterEach(function () {
		DonorsRepository.prototype.get.restore();
	});

	it('should return a donor', function () {
		const model = TestHelper.generate.model('donor');
		sinon.stub(DonorsRepository.prototype, 'get').resolves(model);
		const params = {
			params: {
				donorUuid: model.uuid
			}
		};
		return GetDonor.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, model.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(DonorsRepository.prototype, 'get').rejects('Error');
		const params = {
			params: {
				donorUuid: '1234'
			}
		};
		return GetDonor.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});