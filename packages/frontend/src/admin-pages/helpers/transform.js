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

import Vue from "vue";

/**
 * Transform a map of data using the provided transformers
 *
 * @param {Object} data
 * @param {*} transformers
 * @param {Object} options
 * @returns {Object}
 */
const transformData = function (data, transformers, options) {
	options = _.extend({}, {method: 'transform'}, options);

	let result = _.cloneDeep(data);
	_.forEach(transformers, function (transformer, key) {
		if (result.hasOwnProperty(key)) {
			result[key] = transform(result[key], transformer, options);
		}
	});
	return result;
};

/**
 * Transform the provided value
 *
 * @param {*} value
 * @param {*} transformers
 * @param {Object} options
 * @returns {*}
 */
const transform = function (value, transformers, options) {
	transformers = getTransformers(transformers, options);
	_.forEach(transformers, function (transformer) {
		const transformerFunction = getTransformer(transformer);
		if (_.isFunction(transformerFunction)) {
			value = transformerFunction(value);
		}
	});

	return value;
};

/**
 * Get a transformer
 *
 * @param {*} transformer
 * @returns {*}
 */
const getTransformer = function (transformer) {
	if (_.isString(transformer)) {
		transformer = Vue.filter(transformer);
	}
	return transformer;
};

/**
 * Get the transformers
 *
 * @param {*} transformers
 * @param {Object} options
 * @returns {Array}
 */
const getTransformers = function (transformers, options) {
	if (_.isPlainObject(transformers) && transformers.hasOwnProperty(options.method)) {
		transformers = transformers[options.method];
	}

	if (!_.isArray(transformers)) {
		transformers = [transformers];
	}
	return transformers;
};

export {
	transformData,
	transform
}