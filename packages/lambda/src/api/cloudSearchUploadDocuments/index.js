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

const AWS = require('aws-sdk');
const changeCase = require('change-case');
const CloudSearch = require('./../../aws/cloudSearch');
const logger = require('./../../helpers/log');

exports.handle = function (event, context, callback) {
	logger.log('cloudSearchUploadDocuments event: %j', event);

	const cloudSearch = new CloudSearch();
	const documents = event.Records.map(function (record) {
		const data = {
			id: record.dynamodb.Keys.uuid.S
		};
		if (record.eventName === 'REMOVE') {
			data.type = 'delete';
			return data;
		} else {
			const image = record.dynamodb.NewImage;

			data.type = 'add';
			data.fields = Object.keys(image).reduce(function (prev, next) {
				const value = AWS.DynamoDB.Converter.output(image[next]);
				if (value) {
					prev[changeCase.snakeCase(next)] = value;
				}
				return prev;
			}, {});

			return data;
		}
	});

	cloudSearch.uploadDocuments(process.env.DOC_SERVICE_ENDPOINT, documents).then(function () {
		callback();
	}).catch(function (err) {
		callback(err);
	});
};