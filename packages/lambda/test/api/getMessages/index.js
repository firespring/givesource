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
const GetMessages = require('../../../src/api/getMessages/index');
const MessagesRepository = require('../../../src/repositories/messages');
const TestHelper = require('../../helpers/test');

describe('GetMessages', function () {

	afterEach(function () {
		MessagesRepository.prototype.getAll.restore();
	});

	it('should return a list of messages', function () {
		const models = TestHelper.generate.modelCollection('message', 3);
		sinon.stub(MessagesRepository.prototype, 'getAll').resolves(models);
		return GetMessages.handle({}, null, function (error, results) {
			assert(error === null);
			assert(results.length === 3);
			results.forEach(function (result, i) {
				assert(result.uuid === models[i].uuid);
			});
		});
	});

	it('should return error on exception thrown', function () {
		sinon.stub(MessagesRepository.prototype, 'getAll').rejects('Error');
		return GetMessages.handle({}, null, function (error, results) {
			assert(error instanceof Error);
		});
	});

});