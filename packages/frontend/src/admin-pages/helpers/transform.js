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