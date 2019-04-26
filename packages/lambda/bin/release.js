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

require('./config/bootstrap').bootstrap();

const config = require('config');
const fs = require('fs');
const packageJson = require('../../../package.json');
const path = require('path');
const S3 = require('../src/aws/s3');

/**
 * Check if assets already exist for this version
 *
 * @return {Promise}
 */
const versionExists = function (region) {
	return new Promise(function (resolve, reject) {
		const s3 = new S3();
		const bucketName = config.get('release.AWS_LAMBDA_RELEASE_BUCKET_PREFIX') + '-' + region;
		const keyName = 'fn/' + packageJson.version;
		s3.listObjects(region, bucketName, keyName).then(function (objects) {
			if (objects.length) {
				reject(new Error('a release already exists: s3://' + bucketName + '/' + keyName));
			}
			resolve();
		});
	});
};

/**
 * Upload Lambda functions to the release S3 bucket
 *
 * @param {String} region
 */
const release = function (region) {
	const s3 = new S3();
	const buildDir = path.resolve(__dirname, './../build');
	const functionsDir = path.resolve(__dirname, './../build/functions');
	const functions = fs.readdirSync(functionsDir);
	const bucketName = config.get('release.AWS_LAMBDA_RELEASE_BUCKET_PREFIX') + '-' + region;
	functions.forEach(function (functionName) {
		const objectName = 'fn/' + packageJson.version + '/' + functionName + '.zip';
		const body = fs.readFileSync(buildDir + '/' + functionName + '.zip');
		return s3.putObject(region, bucketName, objectName, body);
	});
};

let promise = Promise.resolve();
if (process.argv[2] !== '--force' && process.argv[2] !== '-F') {
	config.get('release.AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS').forEach(function (region) {
		promise = promise.then(function () {
			return versionExists(region);
		});
	});
}

config.get('release.AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS').forEach(function (region) {
	promise = promise.then(function () {
		return release(region);
	}).then(function () {
		console.log('uploaded to ' + region);
	});
});

promise.then(function () {
	console.log('Lambda functions released');
}).catch(function (err) {
	console.log(err);
});