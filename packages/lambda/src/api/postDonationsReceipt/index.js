/*
 * Copyright (C) 2018  Firespring
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

const Lambda = require('./../../aws/lambda');
const HttpException = require('./../../exceptions/http');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
	const request = new Request(event, context).parameters(['email']);

	request.validate().then(function () {
		const body = {
			email: request.get('email')
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendDonationsReceiptEmail', {body: body});
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};