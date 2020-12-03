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

const FilesRepository = require('./../../repositories/files');
const HttpException = require('./../../exceptions/http');
const Lambda = require('./../../aws/lambda');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
	const repository = new FilesRepository();
	const request = new Request(event, context);
	const s3 = new S3();

	let file = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('file_id'));
	}).then(function (model) {
		file = model;
		return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse');
	}).then(function () {
		return s3.downloadSignedUrl(process.env.AWS_REGION, process.env.AWS_S3_BUCKET, file.path);
	}).then(function (url) {
		callback(null, {
			download_url: url,
			file: file
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};