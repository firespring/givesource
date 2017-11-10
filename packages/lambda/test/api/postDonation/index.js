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
const HttpException = require('./../../../src/exceptions/http');
const PostDonation = require('../../../src/api/postDonation/index');
const DonationsRepository = require('../../../src/repositories/donations');
const sinon = require('sinon');
const TestHelper = require('../../helpers/test');

describe('PostDonation', function () {

	afterEach(function () {
		DonationsRepository.prototype.save.restore();
	});

	it('should return a donation', function () {
		const model = TestHelper.generate.model('donation');
		sinon.stub(DonationsRepository.prototype, 'save').resolves(model);
		const params = {
			body: model.except(['uuid', 'createdOn'])
		};
		return PostDonation.handle(params, null, function (error, result) {
			assert(error === null);
			TestHelper.assertModelEquals(result, model, ['uuid', 'createdOn']);
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(DonationsRepository.prototype, 'save').rejects('Error');
		return PostDonation.handle({}, null, function (error) {
			assert(error instanceof HttpException);
		});
	});

});