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