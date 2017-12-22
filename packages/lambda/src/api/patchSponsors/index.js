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

const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');
const Sponsor = require('./../../models/sponsor');
const SponsorsRepository = require('./../../repositories/sponsors');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new SponsorsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['sponsors']);

	let sponsors = [];
	request.validate().then(function () {
		request.get('sponsors', []).forEach(function (data) {
			sponsors.push(new Sponsor(data));
		});
	}).then(function () {
		let promise = Promise.resolve();
		sponsors.forEach(function (sponsor) {
			promise = promise.then(function () {
				return sponsor.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchSave(request.urlParam('sponsor_tier_uuid'), sponsors);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};