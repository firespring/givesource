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
const GetSetting = require('./../../../src/api/getSetting/index');
const SettingsRepository = require('./../../../src/repositories/settings');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('GetSetting', function () {

	afterEach(function () {
		SettingsRepository.prototype.get.restore();
	});

	it('should return a setting', function () {
		const model = TestHelper.generate.model('setting');
		sinon.stub(SettingsRepository.prototype, 'get').resolves(model);
		const params = {
			params: {
				key: model.key
			}
		};
		return GetSetting.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, model.all());
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(SettingsRepository.prototype, 'get').rejects('Error');
		const params = {
			params: {
				key: '1234'
			}
		};
		return GetSetting.handle(params, null, function (error, result) {
			assert(error instanceof Error);
		});
	});

});