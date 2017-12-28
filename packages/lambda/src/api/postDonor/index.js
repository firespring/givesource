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

const Donor = require('./../../models/donor');
const DonorsRepository = require('./../../repositories/donors');
const HttpException = require('./../../exceptions/http');
const MetricsHelper = require('./../../helpers/metrics');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const repository = new DonorsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	let donor = null;
	request.validate().then(function () {
		if (request.get('email')) {
			return repository.queryEmail(request.get('email'));
		}
		return Promise.resolve();
	}).then(function (model) {
		if (model) {
			donor = model;
		} else {
			donor = new Donor();
			return MetricsHelper.addAmountToMetric('DONORS_COUNT', 1);
		}
	}).then(function () {
		donor.populate(request._body);
		return donor.validate();
	}).then(function () {
		return repository.save(donor);
	}).then(function (response) {
		callback(null, response.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};