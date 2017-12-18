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
const Nonprofit = require('./../../models/nonprofit');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitsRepository();
	const request = new Request(event, context);

	let nonprofit = null;
	request.validate().then(function () {
		return repository.get(request.urlParam('nonprofit_uuid'));
	}).then(function (result) {
		nonprofit = new Nonprofit(result);
		nonprofit.populate(request._body);
		nonprofit.status = result.status;
		return repository.generateUniqueSlug(nonprofit, request.get('slug'));
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