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