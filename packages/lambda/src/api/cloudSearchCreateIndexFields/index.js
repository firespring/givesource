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

const CloudSearch = require('./../../aws/cloudSearch');
const logger = require('./../../helpers/log');
const Model = require('./../../models/model');
const response = require('cfn-response');

exports.handle = function (event, context, callback) {
	logger.log('cloudSearchCreateIndexFields event: %j', event);

	const cloudSearch = new CloudSearch();
	const domainName = event.ResourceProperties.DomainName;
	const modelName = event.ResourceProperties.Model;

	if (event.RequestType === 'Delete' || event.RequestType === 'Update') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const Instance = require(`./../../models/${modelName}`);
	const model = new Instance();

	if (!(model instanceof Model)) {
		logger.log(`${modelName} model not found.`);
		response.send(event, context, response.FAILED);
		return;
	}

	let indexFieldsOptions = [];
	const indexFields = model.getCloudSearchIndexFields();
	for (const key in indexFields) {
		if (indexFields.hasOwnProperty(key)) {
			indexFieldsOptions.push(indexFields[key]);
		}
	}

	cloudSearch.defineIndexFields(domainName, indexFieldsOptions, 500).then(function () {
		return cloudSearch.indexDocuments(domainName);
	}).then(function () {
		response.send(event, context, response.SUCCESS);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};