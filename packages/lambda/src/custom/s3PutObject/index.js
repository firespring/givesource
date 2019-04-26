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

const logger = require('./../../helpers/log');
const response = require('cfn-response');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	logger.log('s3PutObject event: %j', event);

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const s3 = new S3();
	const region = event.ResourceProperties.Region;
	const bucket = event.ResourceProperties.Bucket;
	const key = event.ResourceProperties.Key;
	const body = event.ResourceProperties.Body;

	s3.putObject(region, bucket, key, body).then(function () {
		response.send(event, context, response.SUCCESS);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};