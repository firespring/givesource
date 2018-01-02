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

const HttpException = require('./../../exceptions/http');
const PageContent = require('./../../models/pageContent');
const PageContentsRepository = require('./../../repositories/pageContents');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new PageContentsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['contents']);

	let contents = [];
	request.validate().then(function () {
		request.get('contents', []).forEach(function (data) {
			contents.push(new PageContent(data));
		});
	}).then(function () {
		let promise = Promise.resolve();
		contents.forEach(function (content) {
			promise = promise.then(function () {
				return content.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchSave(request.urlParam('slug'), contents);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};