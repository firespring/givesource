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

const HttpException = require('./../../exceptions/http');
const FileRepository = require('./../../repositories/files');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitSlidesRepository = require('./../../repositories/nonprofitSlides');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	const fileRepository = new FileRepository();
	const repository = new NonprofitSlidesRepository();
	const request = new Request(event, context);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));
	const s3 = new S3();

	let slide = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_uuid'), request.urlParam('slide_uuid'));
	}).then(function (response) {
		slide = response;
		if (slide.fileUuid) {
			let file = null;
			return fileRepository.get(slide.fileUuid).then(function (response) {
				file = response;
				return s3.deleteObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET, `uploads/${file.uuid}`);
			}).then(function () {
				return fileRepository.delete(file.uuid);
			});
		} else {
			return Promise.resolve();
		}
	}).then(function () {
		return repository.delete(request.urlParam('nonprofit_uuid'), request.urlParam('slide_uuid'));
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};