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