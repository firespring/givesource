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