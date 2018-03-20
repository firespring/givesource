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

const Metric = require('./../models/metric');
const MetricsRepository = require('./../repositories/metrics');

/**
 * Add amount to a metric
 *
 * @param {String} key
 * @param {Number} amount
 * @return {Promise}
 */
exports.addAmountToMetric = function (key, amount) {
	const repository = new MetricsRepository();

	let metric = null;
	return repository.batchGet([key]).then(function (metrics) {
		if (metrics.length) {
			metric = metrics.pop();
			metric.populate({value: metric.value += amount});
		} else {
			metric = new Metric({key: key, value: amount});
		}
		return metric.validate();
	}).then(function () {
		return repository.batchUpdate([metric]);
	});
};

/**
 * Update max metric
 *
 * @param {String} key
 * @param {Number} amount
 * @return {Promise}
 */
exports.maxMetricAmount = function (key, amount) {
	const repository = new MetricsRepository();

	let metric = null;
	return repository.batchGet([key]).then(function (metrics) {
		if (metrics.length) {
			metric = metrics.pop();
			if (metric.value < amount) {
				metric.populate({value: amount});
				return metric.validate();
			} else {
				metric = null;
			}
		} else {
			metric = new Metric({key: key, value: amount});
			return metric.validate();
		}
	}).then(function () {
		return metric ? repository.batchUpdate([metric]) : Promise.resolve();
	});
};