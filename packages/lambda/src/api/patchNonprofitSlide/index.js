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
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitSlide = require('./../../dynamo-models/nonprofitSlide');
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