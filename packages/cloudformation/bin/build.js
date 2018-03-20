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
const mkdirp = require('mkdirp');
const mustache = require('mustache');
const path = require('path');
const packageJson = require('./../../../package.json');

const cfDirectory = path.normalize(`${__dirname}/../`);
const buildDirectory = path.normalize(`${cfDirectory}/build/`);
const templatesDirectory = path.normalize(`${cfDirectory}/templates/`);
const awsReleaseBucket = process.env.AWS_RELEASE_BUCKET;
const awsReleaseBucketRegion = process.env.AWS_RELEASE_BUCKET_REGION;
const awsLambdaReleaseBucketPrefix = process.env.AWS_LAMBDA_RELEASE_BUCKET_PREFIX;

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function () {
	const missing = [];
	const required = {
		AWS_RELEASE_BUCKET: awsReleaseBucket,
		AWS_RELEASE_BUCKET_REGION: awsReleaseBucketRegion,
		AWS_LAMBDA_RELEASE_BUCKET_PREFIX: awsLambdaReleaseBucketPrefix,
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
 * Create CloudFormation yaml file from templates
 */
const createCloudFormationYaml = function () {
	const data = {
		version: packageJson.version,
		awsReleaseBucket: awsReleaseBucket,
		awsReleaseBucketRegion: awsReleaseBucketRegion,
		awsLambdaReleaseBucketPrefix: awsLambdaReleaseBucketPrefix,
	};
	const templates = fs.readdirSync(templatesDirectory, 'utf8').filter(function (filename) {
		return filename.indexOf('.') > -1;
	});
	templates.forEach(function (filename) {
		const template = fs.readFileSync(`${templatesDirectory}/${filename}`, 'utf8');
		const rendered = mustache.render(template, data);
		fs.writeFileSync(`${buildDirectory}/${filename}`, rendered);
	});
};

if (validateEnv()) {
	mkdirp.sync(buildDirectory);
	createCloudFormationYaml();
}