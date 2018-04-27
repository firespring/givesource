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

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname, './../../../.env')});
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, './../../../config/');

const CloudFormation = require('./aws/cloudFormation');
const config = require('config');
const packageJson = require('./../../../package.json');

/**
 * Create an AWS CloudFormation stack
 */
const updateStack = function () {
	const cloudFormation = new CloudFormation();
	const url = 'https://s3.' + config.get('release.AWS_RELEASE_BUCKET_REGION') + '.amazonaws.com/' + config.get('release.AWS_RELEASE_BUCKET') + '/cf-templates/' + packageJson.version + '/givesource.yml';
	const parameters = [
		{
			ParameterKey: 'AdminEmail',
			ParameterValue: config.get('app.ADMIN_EMAIL'),
			UsePreviousValue: false
		}
	];
	const optionalParams = {
		ADMIN_PAGES_CNAMES: 'AdminPagesCNAMEs',
		ADMIN_PAGES_SSL_CERTIFICATE_ARN: 'AdminPagesSSLCertificateArn',
		PUBLIC_PAGES_CNAMES: 'PublicPagesCNAMEs',
		PUBLIC_PAGES_SSL_CERTIFICATE_ARN: 'PublicPagesSSLCertificateArn',
	};
	Object.keys(optionalParams).forEach(function (key) {
		if (config.app.hasOwnProperty(key) && config.app[key]) {
			let value = Array.isArray(config.app[key]) ? config.app[key].join(',') : config.app[key];
			parameters.push({
				ParameterKey: optionalParams[key],
				ParameterValue: value,
				UsePreviousValue: false
			});
		}
	});

	return cloudFormation.updateStack(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME'), url, parameters);
};

updateStack().then(function (response) {
	console.log('Stack update in progress: ' + response.StackId);
}).catch(function (err) {
	console.log(err);
});