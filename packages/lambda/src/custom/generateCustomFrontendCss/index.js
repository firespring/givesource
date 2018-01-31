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

const logger = require('./../../helpers/log');
const HttpException = require('./../../exceptions/http');
const ResourceNotFoundException = require('./../../exceptions/resourceNotFound');
const S3 = require('./../../aws/s3');
const SettingsRepository = require('./../../repositories/settings');
const Request = require('./../../aws/request');
const SettingHelper = require('./../../helpers/setting');
const RenderHelper = require('./../../helpers/render');

exports.handle = function (event, context, callback) {
	logger.log('generateCustomFrontendCss event: %j', event);

	const request = new Request(event, context);
	const repository = new SettingsRepository();

	request.validate().then(function () {
		return repository.get(SettingHelper.SETTING_ACCENT_COLOR);
	}).then(function (setting) {
		return generateCssBody(setting.value);
	}).then(function (response) {
		return writeCssFile(response);
	}).then(function () {
		callback();
	}).catch(function (err) {
		if (err instanceof ResourceNotFoundException) {
			// write empty file
			return writeCssFile('').then(function () {
				callback();
			}).catch(function (err) {
				throw err;
			});
		} else {
			throw err;
		}
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});

	/**
	 * Generate custom css body
	 *
	 * @param {String} color
	 * @returns {String}
	 */
	const generateCssBody = function (color) {
		return RenderHelper.renderTemplate('css/custom', {
			color: color
		});
	};

	/**
	 * Write custom css file to s3
	 *
	 * @param {String} body
	 * @returns {Promise}
	 */
	const writeCssFile = function (body) {
		const s3 = new S3();
		const region = process.env.AWS_REGION;
		const bucket = process.env.PUBLIC_PAGES_S3_BUCKET;

		return s3.putObject(region, bucket, 'assets/css/custom.css', body);
	};

};