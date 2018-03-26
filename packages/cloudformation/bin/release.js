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

const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const packageJson = require('./../../../package.json');

const buildDirectory = path.normalize(`${__dirname}/../build/`);
const awsReleaseBucket = process.env.AWS_RELEASE_BUCKET;

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function () {
	const missing = [];
	const required = {
		AWS_RELEASE_BUCKET: awsReleaseBucket,
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

const release = function () {
	const templates = fs.readdirSync(buildDirectory, 'utf8').filter(function (filename) {
		return filename.indexOf('.') > -1;
	});
	templates.forEach(function (filename) {
		const command = `aws s3 cp ${buildDirectory}/${filename} s3://${awsReleaseBucket}/cf-templates/${packageJson.version}/${filename}`;
		const options = {
			maxBuffer: 100 * 1024 * 1024,
			stdio: [0, 1, 2]
		};
		execSync(command, options);
	});
};

if (validateEnv()) {
	release();
}