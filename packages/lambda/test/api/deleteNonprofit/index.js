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
const DeleteNonprofit = require('../../../src/api/deleteNonprofit/index');
const NonprofitsRepository = require('../../../src/repositories/nonprofits');
const TestHelper = require('../../helpers/test');

describe('DeleteNonprofit', function () {

	afterEach(function () {
		NonprofitsRepository.prototype.delete.restore();
	});

	it('should delete a nonprofit', function () {
		const model = TestHelper.generate.model('nonprofit');
		sinon.stub(NonprofitsRepository.prototype, 'delete').resolves(model);
		const params = {
			params: {
				nonprofit_uuid: model.uuid
			}
		};
		return DeleteNonprofit.handle(params, null, function (error, result) {
			assert(error === undefined);
			assert(result === undefined);
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(NonprofitsRepository.prototype, 'delete').rejects('Error');
		const params = {
			params: {
				nonprofit_uuid: '1234'
			}
		};
		return DeleteNonprofit.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});