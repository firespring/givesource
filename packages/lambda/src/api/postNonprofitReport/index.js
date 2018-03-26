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
const Lambda = require('./../../aws/lambda');
const NonprofitResourceMiddleware = require('./../../middleware/nonprofitResource');
const NonprofitReportsRepository = require('./../../repositories/nonprofitReports');
const Report = require('./../../models/report');
const ReportHelper = require('./../../helpers/report');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const lambda = new Lambda();
	const repository = new NonprofitReportsRepository();
	const request = new Request(event, context);
	request.middleware(new NonprofitResourceMiddleware(request.urlParam('nonprofit_uuid'), ['SuperAdmin', 'Admin']));

	const report = new Report({nonprofitUuid: request.urlParam('nonprofit_uuid')});
	request.validate().then(function () {
		report.populate(request._body);
		report.populate({status: ReportHelper.STATUS_PENDING});
		return report.validate();
	}).then(function () {
		return repository.save(request.urlParam('nonprofit_uuid'), report);
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