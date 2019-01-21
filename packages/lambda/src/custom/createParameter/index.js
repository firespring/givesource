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

const logger = require('./../../helpers/log');
const response = require('cfn-response');
const SSM = require('./../../aws/ssm');

exports.handle = (event, context, callback) => {
	logger.log('createParameter event: %j', event);

	const ssm = new SSM();

	const name = event.ResourceProperties.Name ? event.ResourceProperties.Name : null;
	const region = event.ResourceProperties.Region ? event.ResourceProperties.Region : process.env.AWS_REGION;
	const type = event.ResourceProperties.Type ? event.ResourceProperties.Type : 'String';
	const value = event.ResourceProperties.Value ? event.ResourceProperties.Value : null;

	if (event.RequestType === 'Delete') {
		ssm.deleteParameter(region, name).then(() => {
			response.send(event, context, response.SUCCESS);
		}).catch(err => {
			logger.log(err);
			response.send(event, context, response.SUCCESS);
		});
	}

	if (event.RequestType === 'Create' || event.RequestType === 'Update') {
		ssm.putParameter(region, name, value, type).then(() => {
			response.send(event, context, response.SUCCESS);
		}).catch(err => {
			logger.log(err);
			response.send(event, context, response.FAILED);
		});
	}
};