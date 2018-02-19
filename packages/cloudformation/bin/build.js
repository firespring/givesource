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