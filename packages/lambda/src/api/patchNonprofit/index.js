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

const HttpException = require('./../../exceptions/http');
const Nonprofit = require('./../../models/nonprofit');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitsRepository();
	const request = new Request(event, context);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));

	let nonprofit = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_uuid'));
	}).then(function (result) {
		nonprofit = new Nonprofit(result);
		nonprofit.populate(request._body);
		nonprofit.status = result.status;

		if (request.get('slug', false)) {
			return repository.generateUniqueSlug(nonprofit, request.get('slug'));
		} else {
			return Promise.resolve();
		}
	}).then(function () {
		return nonprofit.validate();
	}).then(function () {
		return repository.save(nonprofit);
	}).then(function (model) {
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};