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

const archiver = require('archiver');
const fs = require('fs');
const Lambda = require('./../../aws/lambda');
const logger = require('./../../helpers/log');
const path = require('path');
const response = require('cfn-response');
const S3 = require('./../../aws/s3');

exports.handle = (event, context, callback) => {
	logger.log('createLambdaEdgeFunction event: %j', event);

	const lambda = new Lambda();
	const s3 = new S3();

	const functionName = process.env.AWS_STACK_NAME + '-' + event.ResourceProperties.FunctionName;
	const region = 'us-east-1';
	const role = event.ResourceProperties.Role;
	const runtime = 'nodejs8.10';

	if (event.RequestType === 'Delete') {
		lambda.deleteFunction(region, event.PhysicalResourceId).then(() => {
			response.send(event, context, response.SUCCESS);
		}).catch(err => {
			logger.log(err);
			response.send(event, context, response.SUCCESS);
		});
	}

	let code = null;
	let promise = Promise.resolve();
	if (event.RequestType === 'Create' || event.RequestType === 'Update') {
		if (event.ResourceProperties.hasOwnProperty('Code')) {
			promise = promise.then(() => {
				return new Promise((resolve, reject) => {

					const filePath = path.normalize('/tmp/' + functionName + '.zip');
					const archive = archiver('zip', {zlib: {level: 9}});
					const output = fs.createWriteStream(filePath);

					output.on('close', () => {
						const data = fs.readFileSync(filePath);
						code = new Buffer(data, 'binary');
						resolve();
					});

					archive.on('err', (err) => {
						reject(err);
					});

					archive.on('warning', (err) => {
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

			promise = promise.then(() => {
				return s3.getObject(s3Region, s3Bucket, s3Key);
			}).then(data => {
				code = data.Body;
			});
		} else {
			response.send(event, context, response.FAILED);
			return;
		}

		if (event.RequestType === 'Create') {
			promise = promise.then(() => {
				return lambda.createFunction(region, functionName, 'index.handle', role, runtime, {ZipFile: code});
			});
		} else if (event.RequestType === 'Update') {
			promise = promise.then(() => {
				return lambda.updateFunctionCode(region, functionName, code);
			});
		}

		promise.then(() => {
			return lambda.publishVersion(region, functionName);
		}).then(data => {
			response.send(event, context, response.SUCCESS, {LambdaFunctionARN: data.FunctionArn}, data.FunctionArn);
		}).catch(err => {
			logger.log(err);
			response.send(event, context, response.FAILED);
		});

	} else {
		response.send(event, context, response.SUCCESS);
	}
};