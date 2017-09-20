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

const logger = require('./../../helpers/log');
const response = require('cfn-response');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	logger.log('s3SyncObjects event: %j', event);

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const s3 = new S3();
	const sourceBucket = event.ResourceProperties.SourceBucket;
	const sourceKey = event.ResourceProperties.SourceKey;
	const region = event.ResourceProperties.DestinationRegion;
	const destinationBucket = event.ResourceProperties.DestinationBucket;

	s3.listObjects(region, sourceBucket, sourceKey).then(function (objects) {
		return Promise.all(objects.map(function (obj) {
			const destinationKey = obj.Key.replace(sourceKey + '/', '');
			return s3.copyObject(region, sourceBucket, obj.Key, destinationBucket, destinationKey);
		}));
	}).then(function () {
		response.send(event, context, response.SUCCESS);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};