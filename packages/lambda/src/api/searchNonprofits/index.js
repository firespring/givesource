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

const Fuse = require('fuse.js');
const HttpException = require('./../../exceptions/http');
const NonprofitsRepository = require('./../../repositories/nonprofits');
const ResourceNotFoundException = require('./../../exceptions/resourceNotFound');
const Request = require('./../../aws/request');
const SettingsRepository = require('./../../repositories/settings');
const SettingHelper = require('./../../helpers/setting');

exports.handle = (event, context, callback) => {
	const repository = new NonprofitsRepository();
	const request = new Request(event, context);
	const settingsRepository = new SettingsRepository();
	const includeMatchFund = parseInt(request.queryParam('includeMatchFund', 1));
	let matchFundNonprofitUuid = null;

	request.validate().then(() => {
		if (!includeMatchFund) {
			return settingsRepository.get(SettingHelper.SETTING_MATCH_FUND_NONPROFIT_UUID).then(setting => {
				matchFundNonprofitUuid = setting.value;
			}).catch(err => {
				if (err instanceof ResourceNotFoundException) {
					return Promise.resolve();
				} else {
					return Promise.reject(err);
				}
			});
		}

		return Promise.resolve();
	}).then(() => {
		if (!request.queryParam('category', false) && !request.queryParam('legalName', false) && !request.queryParam('status', false)) {
			return Promise.reject(new Error('Missing required query parameter: category, legalName or status'));
		}
		if (request.queryParam('category', false)) {
			return repository.search(['category1', 'category2', 'category3'], request.queryParam('category'), transformFilters(request.queryParamsExcept(['category', 'c']), matchFundNonprofitUuid));
		}
		if (request.queryParam('legalName', false)) {
			return repository.getAll().then(nonprofits => {
				const options = {
					keys: ['legalName'],
					threshold: 0.3,
				};
				const fuse = new Fuse(nonprofits, options);
				return fuse.search(request.queryParam('legalName'));
			});
		}
		return repository.search(['status'], request.queryParam('status'), transformFilters(request.queryParamsExcept(['status', 'c']), matchFundNonprofitUuid));
	}).then(response => {
		const results = response.map(model => {
			return model.all();
		});
		callback(null, results);
	}).catch(err => {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};

const transformFilters = (filters, matchFundNonprofitUuid) => {
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