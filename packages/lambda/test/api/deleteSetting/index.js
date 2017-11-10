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
const DeleteSetting = require('./../../../src/api/deleteSetting/index');
const SettingsRepository = require('./../../../src/repositories/settings');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('DeleteSetting', function () {

	afterEach(function () {
		SettingsRepository.prototype.delete.restore();
	});

	it('should delete a setting', function () {
		const model = TestHelper.generate.model('setting');
		sinon.stub(SettingsRepository.prototype, 'delete').resolves(model);
		const params = {
			params: {
				key: model.key
			}
		};
		return DeleteSetting.handle(params, null, function (error, result) {
			assert(error === undefined);
			assert(result === undefined);
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(SettingsRepository.prototype, 'delete').rejects('Error');
		const params = {
			params: {
				key: '1234'
			}
		};
		return DeleteSetting.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});