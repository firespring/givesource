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

const CloudFront = require('./../../aws/cloudFront');
const logger = require('./../../helpers/log');
const response = require('cfn-response');

exports.handle = (event, context, callback) => {
	logger.log('associateLambdaEdgeFunctions event: %j', event);

	const cloudFront = new CloudFront();

	const cloudFrontDistribution = event.ResourceProperties.CloudFrontDistribution;
	let functions = event.ResourceProperties.Functions;

	if (!functions || !cloudFrontDistribution) {
		logger.log('Missing required parameter(s).');
		response.send(event, context, response.SUCCESS);
		return;
	}

	functions = JSON.parse(event.ResourceProperties.Functions).functions;
	if (event.RequestType === 'Delete') {
		cloudFront.getDistributionConfig(cloudFrontDistribution).then(data => {
			const eTag = data.ETag;
			const config = data.DistributionConfig;

			if (config.DefaultCacheBehavior) {
				const associations = config.DefaultCacheBehavior.LambdaFunctionAssociations ? config.DefaultCacheBehavior.LambdaFunctionAssociations : {Quantity: 0};
				if (associations.Quantity && associations.Items) {
					associations.Items.forEach((item, index) => {
						functions.forEach(fn => {
							if (item.LambdaFunctionARN === fn.arn) {
								associations.Items.splice(index, 1);
								associations.Quantity = associations.Quantity - 1;
							}
						});
					});
				}
			}
			return cloudFront.updateDistribution(cloudFrontDistribution, eTag, config);
		}).then(() => {
			response.send(event, context, response.SUCCESS);
		}).catch(err => {
			logger.log(err);
			response.send(event, context, response.SUCCESS);
		});
	}

	if (event.RequestType === 'Create' || event.RequestType === 'Update') {
		cloudFront.getDistributionConfig(cloudFrontDistribution).then(data => {
			const eTag = data.ETag;
			const config = data.DistributionConfig;

			if (!config.DefaultCacheBehavior) {
				config.DefaultCacheBehavior = {};
			}

			let associations = config.DefaultCacheBehavior.LambdaFunctionAssociations ? config.DefaultCacheBehavior.LambdaFunctionAssociations : {Quantity: 0};
			functions.forEach(fn => {
				if (associations.Items && associations.Quantity) {
					associations.Items.forEach((item, index) => {
						if (item.LambdaFunctionARN === fn.arn || item.EventType === 'origin-request' || item.EventType === 'origin-response') {
							associations.Items.splice(index, 1);
							associations.Quantity = associations.Quantity - 1;
						}
					});
				}
				associations.Quantity = associations.Quantity + 1;
				associations.Items.push({
					EventType: fn.type,
					LambdaFunctionARN: fn.arn
				});
			});

			config.DefaultCacheBehavior.LambdaFunctionAssociations = associations;
			return cloudFront.updateDistribution(cloudFrontDistribution, eTag, config);
		}).then(() => {
			response.send(event, context, response.SUCCESS);
		}).catch(err => {
			logger.log(err);
			response.send(event, context, response.FAILED);
		});
	}
};