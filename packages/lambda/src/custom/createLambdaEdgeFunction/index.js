/*
 * Copyright (C) 2018  Firespring
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

const archiver = require('archiver');
const CloudFront = require('./../../aws/cloudFront');
const fs = require('fs');
const Lambda = require('./../../aws/lambda');
const logger = require('./../../helpers/log');
const path = require('path');
const response = require('cfn-response');
const S3 = require('./../../aws/s3');

exports.handle = function (event, context, callback) {
	logger.log('createLambdaEdgeFunction event: %j', event);

	const cloudFront = new CloudFront();
	const lambda = new Lambda();
	const s3 = new S3();

	const cloudFrontDistribution = event.ResourceProperties.CloudFrontDistribution;
	const eventType = event.ResourceProperties.EventType;
	const functionName = process.env.AWS_STACK_NAME + '-' + event.ResourceProperties.FunctionName;
	const region = 'us-east-1';
	const role = event.ResourceProperties.Role;
	const runtime = 'nodejs6.10';

	if (event.RequestType === 'Delete') {
		cloudFront.getDistributionConfig(cloudFrontDistribution).then(function (response) {
			const eTag = response.ETag;
			const config = response.DistributionConfig;
			if (config.DefaultCacheBehavior) {
				const associations = config.DefaultCacheBehavior.LambdaFunctionAssociations ? config.DefaultCacheBehavior.LambdaFunctionAssociations : {Quantity: 0};
				if (associations.Quantity && associations.Items) {
					associations.Items.forEach(function (item, index) {
						if (item.LambdaFunctionARN === event.PhysicalResourceId) {
							associations.Items.splice(index, 1);
							associations.Quantity = associations.Quantity - 1;
						}
					});
				}
			}
			return cloudFront.updateDistribution(cloudFrontDistribution, eTag, config);
		}).then(function () {
			return lambda.deleteFunction(region, event.PhysicalResourceId);
		}).then(function () {
			response.send(event, context, response.SUCCESS);
		}).catch(function (err) {
			logger.log(err);
			response.send(event, context, response.SUCCESS);
		});
		return;
	}

	let code = null;
	let promise = Promise.resolve();
	if (event.RequestType === 'Create' || event.RequestType === 'Update') {
		if (event.ResourceProperties.hasOwnProperty('Code')) {
			promise = promise.then(function () {
				return new Promise(function (resolve, reject) {

					const filePath = path.normalize('/tmp/' + functionName + '.zip');
					const archive = archiver('zip', {zlib: {level: 9}});
					const output = fs.createWriteStream(filePath);

					output.on('close', function () {
						const data = fs.readFileSync(filePath);
						code = new Buffer(data, 'binary');
						resolve();
					});

					archive.on('err', function (err) {
						reject(err);
					});

					archive.on('warning', function (err) {
						if (err.code === 'ENOENT') {
							logger.log(err);
						} else {
							reject(err);
						}
					});

					archive.pipe(output);
					archive.append(event.ResourceProperties.Code, {name: 'index.js'});
					archive.finalize();
				});
			});
		} else if (event.ResourceProperties.hasOwnProperty('S3Bucket') && event.ResourceProperties.hasOwnProperty('S3Key') && event.ResourceProperties.hasOwnProperty('S3Region')) {
			const s3Bucket = event.ResourceProperties.S3Bucket;
			const s3Key = event.ResourceProperties.S3Key;
			const s3Region = event.ResourceProperties.S3Region;

			promise = promise.then(function () {
				return s3.getObject(s3Region, s3Bucket, s3Key);
			}).then(function (data) {
				code = data.Body;
			});
		} else {
			response.send(event, context, response.FAILED);
			return;
		}
	} else {
		response.send(event, context, response.SUCCESS);
		return;
	}

	if (event.RequestType === 'Create') {
		promise = promise.then(function () {
			return lambda.createFunction(region, functionName, 'index.handle', role, runtime, {ZipFile: code});
		});
	} else if (event.RequestType === 'Update') {
		promise = promise.then(function () {
			return lambda.updateFunctionCode(region, functionName, code);
		});
	}

	let lambdaFunctionArn = null;
	promise.then(function () {
		return lambda.publishVersion(region, functionName);
	}).then(function (data) {
		lambdaFunctionArn = data.FunctionArn;
		return cloudFront.getDistributionConfig(cloudFrontDistribution);
	}).then(function (data) {
		const eTag = data.ETag;
		const config = data.DistributionConfig;
		if (!config.DefaultCacheBehavior) {
			config.DefaultCacheBehavior = {};
		}
		const associations = config.DefaultCacheBehavior.LambdaFunctionAssociations ? config.DefaultCacheBehavior.LambdaFunctionAssociations : {Quantity: 0};
		if (associations.Quantity && associations.Items) {
			associations.Items.forEach(function (item, index) {
				if (item.LambdaFunctionARN === event.PhysicalResourceId) {
					associations.Items.splice(index, 1);
					associations.Quantity = associations.Quantity - 1;
				}
			});
		}
		associations.Quantity = associations.Quantity + 1;
		associations.Items.push({
			EventType: eventType,
			LambdaFunctionARN: lambdaFunctionArn
		});
		config.DefaultCacheBehavior.LambdaFunctionAssociations = associations;

		return cloudFront.updateDistribution(cloudFrontDistribution, eTag, config);
	}).then(function () {
		response.send(event, context, response.SUCCESS, {LambdaFunctionARN: lambdaFunctionArn}, lambdaFunctionArn);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};