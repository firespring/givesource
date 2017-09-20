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
const NonprofitSlidesRepository = require('./../../repositories/nonprofitSlides');
const Request = require('./../../aws/request');
const Slide = require('./../../models/slide');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitSlidesRepository();
	const request = new Request(event, context).parameters(['slides']);

	let slides = [];
	request.validate().then(function () {
		request.get('slides', []).forEach(function (data) {
			slides.push(new Slide(data));
		});
	}).then(function () {
		let promise = Promise.resolve();
		slides.forEach(function (slide) {
			promise = promise.then(function () {
				return slide.validate();
			});
		});
		return promise;
	}).then(function () {
		return repository.batchSave(request.urlParam('nonprofit_uuid'), slides);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};