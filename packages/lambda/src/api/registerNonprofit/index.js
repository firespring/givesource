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
const NonprofitHelper = require('./../../helpers/nonprofit');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const User = require('./../../models/user');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const nonprofitsRepository = new NonprofitsRepository();
	const usersRepository = new UsersRepository();

	const request = new Request(event, context).parameters(['nonprofit', 'user']);
	const user = new User(request.get('user'));
	const nonprofit = new Nonprofit(request.get('nonprofit'));

	nonprofit.populate({status: NonprofitHelper.STATUS_PENDING});
	request.validate().then(function () {
		return nonprofit.validate();
	}).then(function () {
		user.populate({nonprofitUuid: nonprofit.uuid});
		return user.validate();
	}).then(function () {
		return nonprofitsRepository.save(nonprofit);
	}).then(function () {
		return usersRepository.save(user);
	}).then(function () {
		callback(null, {
			nonprofit: nonprofit.all(),
			user: user.all()
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};