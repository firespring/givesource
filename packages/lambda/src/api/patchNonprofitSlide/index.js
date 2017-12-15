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
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitSlide = require('./../../models/nonprofitSlide');
const NonprofitSlidesRepository = require('./../../repositories/nonprofitSlides');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitSlidesRepository();
	const request = new Request(event, context);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));

	let slide = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_uuid'), request.urlParam('slide_uuid'));
	}).then(function (result) {
		slide = new NonprofitSlide(result);
		slide.populate(request._body);
		return slide.validate();
	}).then(function () {
		return repository.save(request.urlParam('nonprofit_uuid'), slide);
	}).then(function (model) {
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};