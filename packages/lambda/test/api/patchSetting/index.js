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
const PatchSetting = require('../../../src/api/patchSetting/index');
const SettingsRepository = require('./../../../src/repositories/settings');
const sinon = require('sinon');
const TestHelper = require('./../../helpers/test');

describe('PatchSetting', function () {

	afterEach(function () {
		SettingsRepository.prototype.get.restore();
		SettingsRepository.prototype.save.restore();
	});

	it('should return an updated setting', function () {
		const original = TestHelper.generate.model('setting');
		const updated = TestHelper.generate.model('setting', {uuid: original.uuid, key: original.key});
		sinon.stub(SettingsRepository.prototype, 'get').resolves(original);
		sinon.stub(SettingsRepository.prototype, 'save').resolves(updated);
		const params = {
			body: updated.except(['uuid', 'createdOn']),
			params: {
				key: original.key
			}
		};
		return PatchSetting.handle(params, null, function (error, result) {
			assert(error === null);
			assert.deepEqual(result, updated.all());
		});
	});

	it('should return error on exception thrown - get', function () {
		const original = TestHelper.generate.model('setting');
		const params = {
			params: {
				key: original.key
			}
		};
		sinon.stub(SettingsRepository.prototype, 'get').rejects('Error');
		sinon.stub(SettingsRepository.prototype, 'save').resolves(original);
		return PatchSetting.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

	it('should return error on exception thrown - save', function () {
		const original = TestHelper.generate.model('setting');
		const params = {
			params: {
				key: original.key
			}
		};
		sinon.stub(SettingsRepository.prototype, 'get').resolves(original);
		sinon.stub(SettingsRepository.prototype, 'save').rejects('Error');
		return PatchSetting.handle(params, null, function (error) {
			assert(error instanceof Error);
		});
	});

});