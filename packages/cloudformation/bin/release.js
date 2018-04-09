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

const config = require('config');
const fs = require('fs');
const packageJson = require('./../../../package.json');
const S3 = require('./aws/s3');

/**
 * Check if templates already exist for this version
 *
 * @return {Promise}
 */
const versionExists = function () {
	return new Promise(function (resolve, reject) {
		const s3 = new S3();
		const bucketName = config.get('release.AWS_RELEASE_BUCKET');
		const keyName = 'cf-templates/' + packageJson.version;
		s3.listObjects(config.get('release.AWS_RELEASE_BUCKET_REGION'), bucketName, keyName).then(function (objects) {
			if (objects.length) {
				reject(new Error('a release already exists: s3://' + bucketName + '/' + keyName));
			}
			resolve();
		});
	});
};

/**
 * Upload CloudFormation templates to the release S3 bucket
 *
 * @return {Promise}
 */
const release = function () {
	const s3 = new S3();
	const buildDir = path.resolve(__dirname, './../build/');
	const templates = fs.readdirSync(buildDir, 'utf8').filter(function (filename) {
		return filename.indexOf('.') > -1;
	});
	let promise = Promise.resolve();
	templates.forEach(function (filename) {
		promise = promise.then(function () {
			const key = 'cf-templates/' + packageJson.version + '/' + filename;
			const body = fs.readFileSync(buildDir + '/' + filename);
			return s3.putObject(config.get('release.AWS_RELEASE_BUCKET_REGION'), config.get('release.AWS_RELEASE_BUCKET'), key, body)
		}).then(function () {
			console.log('uploaded: s3://' + config.get('release.AWS_RELEASE_BUCKET') + '/cf-templates/' + packageJson.version + '/' + filename);
		});
	});

	return promise;
};

if (process.argv[2] === '--force' || process.argv[2] === '-F') {
	release().then(function () {
		console.log('CloudFormation release complete.');
	});
} else {
	versionExists().then(function () {
		return release();
	}).then(function () {
		console.log('CloudFormation release complete.');
	}).catch(function (err) {
		console.log(err);
	});
}