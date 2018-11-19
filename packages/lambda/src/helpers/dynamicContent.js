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

const _ = require('lodash');
const SettingHelper = require('./setting');
const Lambda = require('./../aws/lambda');

/**
 * Regenerate custom css if the appropriate settings have changed
 *
 * @param {Array} updatedSettings
 * @param {String} awsRegion
 * @param {String} awsStackName
 * @param {Boolean} force
 * @returns {Promise}
 */
exports.regenerateCustomCss = function (updatedSettings, awsRegion, awsStackName, force) {
	const settings = [
		SettingHelper.SETTING_ACCENT_COLOR
	];
	const changedSettings = _.intersection(settings, updatedSettings);
	let promise = Promise.resolve();
	if (changedSettings.length > 0 || force) {
		const lambda = new Lambda();
		promise = lambda.invoke(awsRegion, awsStackName + '-GenerateCustomFrontendCss', {});
	}

	return promise;
};

/**
 * Regenerate public index if the appropriate settings have changed
 *
 * @param {Array} updatedSettings
 * @param {String} awsRegion
 * @param {String} awsStackName
 * @param {Boolean} force
 * @returns {Promise}
 */
exports.regeneratePublicIndex = function (updatedSettings, awsRegion, awsStackName, force) {
	const settings = [
		SettingHelper.SETTING_ADMIN_URL,
		SettingHelper.SETTING_API_URL,
		SettingHelper.SETTING_CONTACT_PHONE,
		SettingHelper.SETTING_CUSTOM_PAGES,
		SettingHelper.SETTING_DATE_DONATIONS_END,
		SettingHelper.SETTING_DATE_DONATIONS_START,
		SettingHelper.SETTING_DATE_EVENT_END,
		SettingHelper.SETTING_DATE_EVENT_START,
		SettingHelper.SETTING_DATE_REGISTRATIONS_END,
		SettingHelper.SETTING_DATE_REGISTRATIONS_START,
		SettingHelper.SETTING_EVENT_LOGO,
		SettingHelper.SETTING_EVENT_TIMEZONE,
		SettingHelper.SETTING_EVENT_TITLE,
		SettingHelper.SETTING_EVENT_URL,
		SettingHelper.SETTING_FAVICON,
		SettingHelper.SETTING_FOUNDATION_LOGO,
		SettingHelper.SETTING_FOUNDATION_URL,
		SettingHelper.SETTING_GOOGLE_ANALYTICS_TRACKING_ID,
		SettingHelper.SETTING_MASTHEAD_IMAGE,
		SettingHelper.SETTING_PAGE_ABOUT_ENABLED,
		SettingHelper.SETTING_PAGE_FAQ_ENABLED,
		SettingHelper.SETTING_PAGE_TERMS_ENABLED,
		SettingHelper.SETTING_PAGE_TOOLKIT_ENABLED,
		SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE,
		SettingHelper.SETTING_PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE,
		SettingHelper.SETTING_PUBLIC_INDEX_TEMPLATE,
		SettingHelper.SETTING_SOCIAL_SHARING_DESCRIPTION,
		SettingHelper.SETTING_SOCIAL_SHARING_IMAGE,
		SettingHelper.SETTING_UPLOADS_CLOUD_FRONT_URL,
	];
	const changedSettings = _.intersection(settings, updatedSettings);
	let promise = Promise.resolve();
	if (changedSettings.length > 0 || force) {
		const lambda = new Lambda();
		promise = lambda.invoke(awsRegion, awsStackName + '-GeneratePublicIndexFile', {});
	}

	return promise;
};

/**
 * Regenerate dynamic content
 *
 * @param {Array} updatedSettings
 * @param {String} awsRegion
 * @param {String} awsStackName
 * @param {Boolean} force
 * @returns {Promise}
 */
exports.regenerateDynamicContent = function (updatedSettings, awsRegion, awsStackName, force) {
	const helper = this;

	return helper.regenerateCustomCss(updatedSettings, awsRegion, awsStackName, force).then(function () {
		return helper.regeneratePublicIndex(updatedSettings, awsRegion, awsStackName, force);
	});
};