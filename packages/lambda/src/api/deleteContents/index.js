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

const _ = require('lodash');
const Content = require('./../../models/content');
const ContentHelper = require('./../../helpers/content');
const ContentsRepository = require('./../../repositories/contents');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new ContentsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['contents']);

	let contents = [];
	request.validate().then(function () {
		request.get('contents', []).forEach(function (data) {
			contents.push(new Content(data));
		});
	}).then(function () {
		contents.forEach(function (content) {
			if (content.type === ContentHelper.TYPE_COLLECTION) {
				return repository.getByParentUuid(content.uuid).then(function (response) {
					response.forEach(function (model) {
						if (!_.find(contents, {uuid: model.uuid})) {
							contents.push(model);
						}
					});
				});
			}
		});
	}).then(function () {
		return repository.batchDelete(contents);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};