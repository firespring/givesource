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

const File = require('./../../models/file');
const FilesRepository = require('./../../repositories/files');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const S3 = require('./../../aws/s3');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const s3 = new S3();
	const repository = new FilesRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin', 'Nonprofit'])).parameters(['content_type', 'filename']);

	let file = null;
	const bucket = process.env.UPLOADS_BUCKET;

	request.validate().then(function () {
		file = new File({filename: request.get('filename')});
		file.populate({path: `uploads/${file.uuid}`});
		return file.validate();
	}).then(function () {
		return repository.save(file);
	}).then(function (model) {
		file = model;
		return s3.getSignedUrl(process.env.AWS_REGION, bucket, file.path, request.get('content_type'));
	}).then(function (url) {
		callback(null, {
			upload_url: url,
			file: file.all()
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};