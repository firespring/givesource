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

const File = require('./../../models/file');
const FilesRepository = require('./../../repositories/files');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new FilesRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['files']);
	const s3 = new S3();

	let files = [];
	request.validate().then(function () {
		let promise = Promise.resolve();
		request.get('files', []).forEach(function (file) {
			files.push(new File(file));
			promise = promise.then(function () {
				return s3.deleteObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET, `uploads/${file.uuid}`);
			});
		});
		return promise;
	}).then(function () {
		return repository.batchDelete(files);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};