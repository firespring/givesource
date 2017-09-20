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
const execSync  = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const packageJson = require('../../../package.json');
const S3 = require('../src/aws/s3');

dotenv.config({path: `${__dirname}/../../../.env`});

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
 * Build lambda function zip with Apex
 *
 * @param {String} functionName
 */
const buildFunction = function (functionName) {
	const command = `/usr/local/bin/apex build ${functionName} > ${functionName}.zip`;
	const options = {
		cwd: buildDirectory,
		maxBuffer: 100 * 1024 * 1024
	};
	execSync(command, options);
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
	const functions = fs.readdirSync(functionsDirectory);
	functions.forEach(function (func) {
		buildFunction(func);
	});

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
