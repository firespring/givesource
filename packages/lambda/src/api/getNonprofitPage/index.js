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
const NonprofitHelper = require('./../../helpers/nonprofit');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const ResourceNotFoundException = require('./../../exceptions/resourceNotFound');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context);
	const repository = new NonprofitsRepository();

	request.validate().then(function () {
		return repository.getBySlug(request.urlParam('slug'));
	}).then(function (nonprofit) {
		if (nonprofit.status !== NonprofitHelper.STATUS_ACTIVE) {
			return Promise.reject(new ResourceNotFoundException('The specified nonprofit does not exist.'));
		}
		callback(null, nonprofit.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};