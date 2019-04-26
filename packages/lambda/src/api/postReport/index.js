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
const Report = require('./../../models/report');
const ReportHelper = require('./../../helpers/report');
const ReportsRepository = require('./../../repositories/reports');
const Request = require('./../../aws/request');
const UserGroupMiddleware = require('./../../middleware/userGroup');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
	const repository = new ReportsRepository();
	const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']));

	const report = new Report(request._body);
	request.validate().then(function () {
		report.populate({status: ReportHelper.STATUS_PENDING});
		return report.validate();
	}).then(function () {
		return repository.save(report);
	}).then(function (model) {
		const body = model.all();
		if (request.get('name', false)) {
			body['name'] = request.get('name');
		}
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-GenerateReport', {body: body});
		callback(null, model.all());
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};