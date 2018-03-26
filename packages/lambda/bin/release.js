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
dotenv.config({path: `${__dirname}/../../../.env`});

const fs = require('fs');
const path = require('path');
const packageJson = require('../../../package.json');
const S3 = require('../src/aws/s3');

const buildDirectory = path.normalize(`${__dirname}/../build`);
const functionsDirectory = path.normalize(`${buildDirectory}/functions`);

const awsLambdaReleaseBucketPrefix = process.env.AWS_LAMBDA_RELEASE_BUCKET_PREFIX;
const awsLambdaReleaseBucketAvailableRegions = process.env.AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS;

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function () {
	const missing = [];
	const required = {
		AWS_LAMBDA_RELEASE_BUCKET_PREFIX: awsLambdaReleaseBucketPrefix,
		AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS: awsLambdaReleaseBucketAvailableRegions
	};
	for (let key in required) {
		if (typeof required[key] === 'undefined') {
			missing.push(key);
		}
	}
	if (missing.length > 0) {
		console.error(`Missing env variables: ${JSON.stringify(missing)}`);
		process.exit(1);
	}
	return true;
};

/**
 * Check if lambda functions already exist for this version on this region
 *
 * @param {String} region
 * @return {Promise}
 */
const functionsExist = function (region) {
	return new Promise(function (resolve, reject) {
		const s3 = new S3();
		const bucketName = `${awsLambdaReleaseBucketPrefix}-${region}`;
		const keyName = `fn/${packageJson.version}`;
		s3.listObjects(region, bucketName, keyName).then(function (objects) {
			if (objects.length !== 0) {
				reject(new Error(`objects already exist under ${bucketName}/${keyName}`));
			}
			resolve();
		});
	});
};

/**
 * Upload lambda functions to S3
 *
 * @param {String} region
 */
const upload = function (region) {
	const s3 = new S3();
	const functions = fs.readdirSync(functionsDirectory);
	const bucketName = `${awsLambdaReleaseBucketPrefix}-${region}`;
	functions.forEach(function (func) {
		const objectName = `fn/${packageJson.version}/${func}.zip`;
		const body = fs.readFileSync(`${buildDirectory}/${func}.zip`);
		s3.putObject(region, bucketName, objectName, body).catch(function (err) {
			console.log(err);
			process.exit(1);
		});
	});
};

/**
 * Create a release
 *
 * @param {boolean} [force]
 */
const release = function (force) {
	force = (typeof force === 'boolean') ? force : false;
	awsLambdaReleaseBucketAvailableRegions.split('|').forEach(function (region) {
		functionsExist(region).then(function () {
			upload(region);
		}).catch(function (err) {
			if (force) {
				upload(region);
			} else {
				console.log(err.message);
				process.exit(1);
			}
		}).then(function () {
			console.log(`uploaded to ${region}`);
		});
	});
};

if (validateEnv()) {
	const force = (process.argv[2] === '--force' || process.argv[2] === '-F');
	release(force);
}
