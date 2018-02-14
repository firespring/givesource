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
const NonprofitsRepository = require('./../../repositories/nonprofits');
const Request = require('./../../aws/request');
const SettingsRepository = require('./../../repositories/settings');
const SettingHelper = require('./../../helpers/setting');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitsRepository();
	const request = new Request(event, context);
	const settingsRepository = new SettingsRepository();
	const includeMatchFund = parseInt(request.queryParam('includeMatchFund', 1));
	let matchFundNonprofitUuid = null;

	request.validate().then(function () {
		if (!includeMatchFund) {
			return settingsRepository.get(SettingHelper.SETTING_MATCH_FUND_NONPROFIT_UUID).then(function (setting) {
				matchFundNonprofitUuid = setting.value;
			}).catch(function (err) {
				console.log(err);
			});
		}

		return Promise.resolve();
	}).then(function () {
		if (!request.queryParam('category', false) && !request.queryParam('legalName', false) && !request.queryParam('status', false)) {
			return Promise.reject(new Error('Missing required query parameter: category, legalName or status'));
		}
		if (request.queryParam('category', false)) {
			return repository.search(['category1', 'category2', 'category3'], request.queryParam('category'), transformFilters(request.queryParamsExcept(['category']), matchFundNonprofitUuid));
		}
		if (request.queryParam('legalName', false)) {
			return repository.search(['legalNameSearch'], request.queryParam('legalName'), transformFilters(request.queryParamsExcept(['legalName']), matchFundNonprofitUuid));
		}
		return repository.search(['status'], request.queryParam('status'), transformFilters(request.queryParamsExcept(['status']), matchFundNonprofitUuid));
	}).then(function (response) {
		const results = response.map(function (model) {
			return model.all();
		});
		callback(null, results);
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};

const transformFilters = function (filters, matchFundNonprofitUuid) {
	if (filters.hasOwnProperty('legalName')) {
		filters.legalNameSearch = filters.legalName;
		delete filters.legalName;
	}

	if (filters.hasOwnProperty('includeMatchFund')) {
		const includeMatchFund = parseInt(filters.includeMatchFund);
		if (!includeMatchFund && matchFundNonprofitUuid) {
			filters.uuid = {
				conditional: '!=',
				value: matchFundNonprofitUuid
			};
		}
		delete filters.includeMatchFund;
	}
	return filters;
};