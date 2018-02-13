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

const _ = require('lodash');
const logger = require('./../../helpers/log');
const HttpException = require('./../../exceptions/http');
const S3 = require('./../../aws/s3');
const SettingsRepository = require('./../../repositories/settings');
const FileRepository = require('./../../repositories/files');
const Request = require('./../../aws/request');
const RenderHelper = require('./../../helpers/render');

exports.handle = function (event, context, callback) {
	logger.log('generatePublicIndexFile event: %j', event);

	const request = new Request(event, context);
	const repository = new SettingsRepository();
	const fileRepository = new FileRepository();

	const settings = {
		EVENT_TITLE: null,
		EVENT_URL: null,
		PUBLIC_INDEX_TEMPLATE: null,
		SOCIAL_SHARING_DESCRIPTION: null,
		SOCIAL_SHARING_IMAGE: null,
		UPLOADS_CLOUDFRONT_URL: null
	};
	request.validate().then(function () {
		return repository.batchGet(Object.keys(settings));
	}).then(function (response) {
		_.forEach(response, function (setting) {
			if (settings.hasOwnProperty(setting.key)) {
				settings[setting.key] = setting.value;
			}
		});

		let promise = Promise.resolve();
		if (settings.SOCIAL_SHARING_IMAGE) {
			promise = fileRepository.get(settings.SOCIAL_SHARING_IMAGE);
		}
		return promise;
	}).then(function (file) {
		if (file) {
			settings.SOCIAL_SHARING_IMAGE = (file) ? settings.UPLOADS_CLOUDFRONT_URL + '/' + file.path : null;
		}

		return generateIndexBody(settings.PUBLIC_INDEX_TEMPLATE, _.omit(settings, 'PUBLIC_INDEX_TEMPLATE'));
	}).then(function (response) {
		return writeIndexFile(response);
	}).then(function () {
		callback();
	}).catch(function (err) {
		(err instanceof HttpException) ? callback(err.context(context)) : callback(err);
	});

	/**
	 * Generate contents of the index file
	 *
	 * @param template
	 * @param settings
	 * @returns {Promise}
	 */
	const generateIndexBody = function (template, settings) {
		return RenderHelper.renderStringTemplate(template, {settings: settings});
	};

	/**
	 * Write public index file to s3
	 *
	 * @param {String} body
	 * @returns {Promise}
	 */
	const writeIndexFile = function (body) {
		const s3 = new S3();
		const region = process.env.AWS_REGION;
		const bucket = process.env.PUBLIC_PAGES_S3_BUCKET;

		return s3.putObject(region, bucket, 'index.html', body);
	};

};