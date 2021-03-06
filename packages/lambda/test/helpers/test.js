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
const Generator = require('./../../src/helpers/generator');
const promiseMe = require('mocha-promise-me');

/**
 * Load the Generator
 *
 * @type {Generator}
 */
module.exports.generate = new Generator();

/**
 * Assert multiple validation test cases
 *
 * @param {[]} testCases
 */
module.exports.validate = function (testCases) {
	testCases.forEach((testCase) => {
		const throws = testCase.error ? 'throw' : 'not throw';
		it(`should ${throws} error on ${format(testCase.value)} ${testCase.param}`, () => {
			let data = {};
			data[testCase.param] = testCase.value;
			testCase.model.populate(data);
			if (testCase.error) {
				return promiseMe.thatYouReject(testCase.model.validate());
			} else {
				return promiseMe.thatYouResolve(testCase.model.validate());
			}
		});
	});
};

/**
 * Compare a data object to a model
 *
 * @param {{}} data
 * @param {Model} model
 * @param {Array} [except]
 * @return {boolean}
 */
module.exports.assertModelEquals = function (data, model, except) {
	let equality = true;
	const modelData = model.all();
	Object.keys(data).forEach(function (key) {
		if (except.indexOf(key) < 0) {
			if (data.hasOwnProperty(key) && modelData.hasOwnProperty(key) && data[key] !== modelData[key]) {
				equality = false;
			}
		}
	});

	assert(equality === true);
};

/**
 * Format value for console output
 *
 * @param {*} value
 * @return {*}
 */
const format = function (value) {
	if (value === null) {
		return 'null';
	}

	if (typeof value === 'undefined') {
		return 'undefined';
	}

	if (typeof value === 'string') {
		return `"${value}"`;
	}

	return value;
};