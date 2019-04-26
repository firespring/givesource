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
const Lambda = require('./../../aws/lambda');
const Nonprofit = require('./../../models/nonprofit');
const NonprofitHelper = require('./../../helpers/nonprofit');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const User = require('./../../models/user');
const UsersRepository = require('./../../repositories/users');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
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
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendRegistrationPendingEmail', {body: {email: user.email}});
	}).then(function () {
		callback(null, {
			nonprofit: nonprofit.all(),
			user: user.all()
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};