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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../.env`});

const _ = require('lodash');
const CloudFormation = require('./aws/cloudFormation');
const fs = require('fs');
const path = require('path');

/**
 * Get output key from stack
 *
 * @param {{}} outputs
 * @param {String} outputKey
 * @return {*}
 */
const findOutputKey = function (outputs, outputKey) {
	const output = _.find(outputs, {OutputKey: outputKey});
	if (output && output.OutputValue) {
		return output.OutputValue;
	} else {
		throw new Error(outputKey + ' not found');
	}
};

/**
 * Get Stack settings
 *
 * @return {Promise}
 */
const getSettings = function () {
	const cloudFormation = new CloudFormation();
	return cloudFormation.describeStacks(process.env.AWS_REGION, process.env.AWS_STACK_NAME).then(function (stacks) {
		if (stacks.length !== 1) {
			return Promise.reject(new Error('unexpected number of stacks'));
		} else {
			const stack = stacks[0];
			return Promise.resolve({
				API_URL: findOutputKey(stack.Outputs, 'ApiUrl'),
				AdminPagesCloudFrontDistribution: findOutputKey(stack.Outputs, 'AdminPagesCloudFrontDistribution'),
				AdminPagesS3BucketName: findOutputKey(stack.Outputs, 'AdminPagesS3BucketName'),
				AdminPagesS3BucketUrl: findOutputKey(stack.Outputs, 'AdminPagesS3BucketUrl'),
				PublicPagesCloudFrontDistribution: findOutputKey(stack.Outputs, 'PublicPagesCloudFrontDistribution'),
				PublicPagesS3BucketName: findOutputKey(stack.Outputs, 'PublicPagesS3BucketName'),
				PublicPagesS3BucketUrl: findOutputKey(stack.Outputs, 'PublicPagesS3BucketUrl'),
				UploadsCloudFrontDistribution: findOutputKey(stack.Outputs, 'UploadsCloudFrontDistribution'),
			});
		}
	});
};

/**
 * Write config file
 *
 * @param {String} filename
 * @param {{}} data
 */
const writeConfig = function (filename, data) {
	const jsonData = JSON.stringify(data, null, 2);
	const filePath = path.normalize(__dirname + '/../config/' + filename);
	fs.writeFileSync(filePath, jsonData);
	console.log(filename + ' created');
};

getSettings().then(function (data) {
	const settings = {
		API_URL: null
	};
	const deployInfo = {
		AdminPagesCloudFrontDistribution: null,
		AdminPagesS3BucketName: null,
		AdminPagesS3BucketUrl: null,
		PublicPagesCloudFrontDistribution: null,
		PublicPagesS3BucketName: null,
		PublicPagesS3BucketUrl: null,
		UploadsCloudFrontDistribution: null,
	};
	Object.keys(data).forEach(function (key) {
		if (settings.hasOwnProperty(key)) {
			settings[key] = data[key];
		}
		if (deployInfo.hasOwnProperty(key)) {
			deployInfo[key] = data[key];
		}
	});

	writeConfig('settings.json', settings);
	writeConfig('deploy-info.json', deployInfo);
}).catch(function (err) {
	console.log(err);
});