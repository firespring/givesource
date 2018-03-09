/*
 * Copyright (C) 2018  Firespring
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

/*
 * Copyright (C) 2018  Firespring
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

const AWS = require('aws-sdk');

/**
 * CloudFront constructor
 *
 * @constructor
 */
function CloudFront() {
}

/**
 * Create an AWS CloudFront invalidation
 *
 * @param {String} id
 * @param {[]} paths
 * @return {Promise}
 */
CloudFront.prototype.createInvalidation = function (id, paths) {
	const awsCloudFront = new AWS.CloudFront();
	return new Promise(function (resolve, reject) {
		const timestamp = new Date().getTime();
		const params = {
			DistributionId: id,
			InvalidationBatch: {
				CallerReference: timestamp.toString(),
				Paths: {
					Quantity: paths.length,
					Items: [
						paths.join(',')
					]
				}
			}
		};
		awsCloudFront.createInvalidation(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Get an AWS CloudFront distribution config
 *
 * @param {String} id
 * @return {Promise}
 */
CloudFront.prototype.getDistributionConfig = function (id) {
	const awsCloudFront = new AWS.CloudFront();
	return new Promise(function (resolve, reject) {
		const params = {
			Id: id
		};
		awsCloudFront.getDistributionConfig(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Update an AWS CloudFront distribution
 *
 * @param {String} id
 * @param {String} eTag
 * @param {{}} config
 * @return {Promise}
 */
CloudFront.prototype.updateDistribution = function (id, eTag, config) {
	const awsCloudFront = new AWS.CloudFront();
	return new Promise(function (resolve, reject) {
		const params = {
			Id: id,
			IfMatch: eTag,
			DistributionConfig: config
		};
		awsCloudFront.updateDistribution(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports = CloudFront;