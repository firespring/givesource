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
const PostDonor = require('../../../src/api/postDonor/index');
const DonorsRepository = require('../../../src/repositories/donors');
const TestHelper = require('../../helpers/test');

describe('PostDonor', function () {

	afterEach(function () {
		DonorsRepository.prototype.queryEmail.restore();
		DonorsRepository.prototype.save.restore();
	});

	it('should update a donor by email', function () {
		const data = TestHelper.generate.model('donor');
		const donor = TestHelper.generate.model('donor', {email: data.email});
		sinon.stub(DonorsRepository.prototype, 'queryEmail').resolves(data);
		sinon.stub(DonorsRepository.prototype, 'save').resolves(data);
		const params = {
			body: data.all()
		};
		return PostDonor.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, data.all());
		});
	});

	it('should return error on exception thrown', function () {
		const data = TestHelper.generate.model('donor');
		sinon.stub(DonorsRepository.prototype, 'queryEmail').resolves(data);
		sinon.stub(DonorsRepository.prototype, 'save').rejects('Error');
		return PostDonor.handle({}, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});