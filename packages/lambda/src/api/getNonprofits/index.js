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
const NonprofitsRepository = require('./../../repositories/nonprofits');
const QueryBuilder = require('./../../aws/queryBuilder');
const ResourceNotFoundException = require('./../../exceptions/resourceNotFound');
const Request = require('./../../aws/request');
const SettingsRepository = require('./../../repositories/settings');
const SettingHelper = require('./../../helpers/setting');
const Sequelize = require('sequelize');

exports.handle = function (event, context, callback) {
	const repository = new NonprofitsRepository();
	const settingsRepository = new SettingsRepository();
	const request = new Request(event, context);
	const findAllAndCountParams = {};

	let total = 0;
	let items = [];

	const size = request.queryParam('size', 10);
	const sort = request.queryParam('sort', 'all_created_on_descending');
	const start = request.queryParam('start', 0);
	const includeMatchFund = parseInt(request.queryParam('includeMatchFund', 1));

	findAllAndCountParams.limit = size;
	findAllAndCountParams.order = [['createdAt', 'DESC']];
	findAllAndCountParams.offset = start;

	const index = getIndex(sort);
	const hash = getHashCondition(sort);
	const range = getRangeCondition(sort);
	const scanIndexForward = getScanIndexForward(sort);
	let matchFundNonprofitUuid = null;

	request.validate().then(function () {
		if (!includeMatchFund) {
			return settingsRepository.get(SettingHelper.SETTING_MATCH_FUND_NONPROFIT_UUID).then(function (setting) {
				matchFundNonprofitUuid = setting.value;
			}).catch(function (err) {
				if (err instanceof ResourceNotFoundException) {
					return Promise.resolve();
				} else {
					return Promise.reject(err);
				}
			});
		}

		return Promise.resolve();
	}).then(function () {
		if (matchFundNonprofitUuid) {
			findAllAndCountParams.where = {[Sequelize.Op.ne]: [{id: matchFundNonprofitUuid}]}
		}
		return repository.queryNonprofits(findAllAndCountParams);
	}).then(function (response) {
		total = response.count;
		items = response.rows;
	// 	if (matchFundNonprofitUuid && items.length > size) {
	// 		items.pop();
	// 	}
		callback(null, {
			items: items,
			size: size,
			sort: sort,
			start: start,
			total: total
		});
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});
};

const getIndex = function (sort) {
	switch (sort) {
		case 'active_subtotal_ascending':
		case 'active_subtotal_descending':
		case 'denied_subtotal_ascending':
		case 'denied_subtotal_descending':
		case 'pending_subtotal_ascending':
		case 'pending_subtotal_descending':
			return 'statusSubtotalIndex';

		case 'active_legal_name_ascending':
		case 'active_legal_name_descending':
		case 'denied_legal_name_ascending':
		case 'denied_legal_name_descending':
		case 'pending_legal_name_ascending':
		case 'pending_legal_name_descending':
			return 'statusLegalNameIndex';

		case 'all_legal_name_ascending':
		case 'all_legal_name_descending':
			return 'isDeletedLegalNameIndex';

		case 'all_created_on_ascending':
		case 'all_created_on_descending':
		default:
			return 'isDeletedCreatedOnIndex';
	}
};

const getHashCondition = function (sort) {
	switch (sort) {
		case 'active_subtotal_ascending':
		case 'active_subtotal_descending':
		case 'active_legal_name_ascending':
		case 'active_legal_name_descending':
			return ['status', '=', 'ACTIVE'];

		case 'denied_subtotal_ascending':
		case 'denied_subtotal_descending':
		case 'denied_legal_name_ascending':
		case 'denied_legal_name_descending':
			return ['status', '=', 'DENIED'];

		case 'pending_subtotal_ascending':
		case 'pending_subtotal_descending':
		case 'pending_legal_name_ascending':
		case 'pending_legal_name_descending':
			return ['status', '=', 'PENDING'];

		case 'all_legal_name_ascending':
		case 'all_legal_name_descending':
		case 'all_created_on_ascending':
		case 'all_created_on_descending':
		default:
			return ['isDeleted', '=', 0];
	}
};

const getRangeCondition = function (sort) {
	switch (sort) {
		case 'active_subtotal_ascending':
		case 'active_subtotal_descending':
		case 'denied_subtotal_ascending':
		case 'denied_subtotal_descending':
		case 'pending_subtotal_ascending':
		case 'pending_subtotal_descending':
			return ['donationsSubtotal', '>=', 0];

		case 'active_legal_name_ascending':
		case 'active_legal_name_descending':
		case 'denied_legal_name_ascending':
		case 'denied_legal_name_descending':
		case 'pending_legal_name_ascending':
		case 'pending_legal_name_descending':
		case 'all_legal_name_ascending':
		case 'all_legal_name_descending':
			return ['legalNameSearch', '>', ' '];

		case 'all_created_on_ascending':
		case 'all_created_on_descending':
		default:
			return ['createdOn', '>', 0];
	}
};

const getScanIndexForward = function (sort) {
	switch (sort) {
		case 'active_subtotal_ascending':
		case 'active_legal_name_ascending':
		case 'denied_subtotal_ascending':
		case 'denied_legal_name_ascending':
		case 'pending_subtotal_ascending':
		case 'pending_legal_name_ascending':
		case 'all_legal_name_ascending':
		case 'all_created_on_ascending':
			return true;
	}

	return false;
};