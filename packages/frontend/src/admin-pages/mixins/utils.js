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

const mixin = {
	methods: {
		sync: function (object, sources) {
			object = JSON.parse(JSON.stringify(object));
			sources = Array.isArray(sources) ? sources : [sources];
			Object.keys(object).forEach(function (key) {
				sources.forEach(function (source) {
					source = JSON.parse(JSON.stringify(source));
					if (source.hasOwnProperty(key) && source[key] !== undefined && source[key] !== null) {
						object[key] = source[key];
					}
				});
			});
			return object;
		},
		getUpdatedParameters: function (data, originals) {
			const mixin = this;

			const params = {};
			data = JSON.parse(JSON.stringify(data));
			originals = Array.isArray(originals) ? originals : [originals];
			Object.keys(data).forEach(function (key) {
				originals.forEach(function (original) {
					original = JSON.parse(JSON.stringify(original));
					if (!original.hasOwnProperty(key) || original[key] !== data[key] || (mixin.isEmptyParam(original[key]) && !mixin.isEmptyParam(data[key])) || (!mixin.isEmptyParam(original[key]) && mixin.isEmptyParam(data[key]))) {
						params[key] = data[key];
					}
				});
			});
			return params;
		},
		isEmptyParam: function (param) {
			return param === undefined || param === null || param === '';
		}
	}
};

export default mixin;