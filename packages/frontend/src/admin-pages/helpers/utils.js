/*
 * Copyright 2018 Firespring, Inc.
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

const generateQueryString = function (object) {
	const params = [];
	Object.keys(object).forEach(function (key) {
		if (object.hasOwnProperty(key)) {
			const value = encodeURIComponent(object[key]);
			params.push(key + '=' + value);
		}
	});
	return '?' + params.join('&');
};

/**
 * Sort two objects alphabetically by key
 * @param {{}} a
 * @param {{}} b
 * @param {String} key
 * @return {number}
 */
const sortAlphabetically = function (a, b, key) {
	if (a.hasOwnProperty(key) && b.hasOwnProperty(key) && a[key] < b[key]) {
		return -1;
	} else if (a.hasOwnProperty(key) && b.hasOwnProperty(key) && a[key] > b[key]) {
		return 1;
	}

	return 0;
};

export {
	generateQueryString,
	sortAlphabetically
}