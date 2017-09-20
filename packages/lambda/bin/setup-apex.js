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
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

dotenv.config({path: `${__dirname}/../../../.env`});

const buildDirectory = path.normalize(`${__dirname}/../build`);
const stackName = process.env.AWS_STACK_NAME;
const lambdaRole = process.env.AWS_RELEASE_ARN_ROLE;

/**
 * Validate the incoming arguments
 *
 * @return {boolean}
 */
const validateArguments = function () {
	const valid = ['release', 'dev'];
	if (process.argv.length >= 3) {
		if (valid.indexOf(process.argv[2].toLowerCase()) > -1) {
			return true;
		}
	}
	console.error('Usage: setup-apex.js [release|dev]');
	process.exit(1);
};

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function (isRelease) {
	const missing = [];
	const required = {
		STACK_NAME: stackName,
	};
	if (isRelease) {
		required['AWS_RELEASE_ARN_ROLE'] = lambdaRole;
	}
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
 * Get AWS arn
 *
 * @param {[]} resourceIds
 * @param {String} keyName
 * @return {String}
 */
const getArn = function (resourceIds, keyName) {
	let arn;
	resourceIds.some(function (resourceId) {
		if (resourceId.OutputKey === keyName) {
			arn = resourceId.OutputValue;
		}
	});
	if (!arn) {
		console.log('Error no required arn');
		process.exit(1);
	}
	return arn;
};

/**
 * Write the functions.json file to target directories
 *
 * @param {String} role
 * @param {int} timeout
 * @param {int} memory
 * @param {[]} targetDirectories
 */
const createFunctionJson = function (role, timeout, memory, targetDirectories) {
	const json = JSON.stringify({role, timeout, memory}, null, 2);
	targetDirectories.forEach(function (directory) {
		mkdirp.sync(directory);
		fs.writeFileSync(`${directory}/functions.json`, json);
		console.log(`${directory}/function.json created`);
	});
};

if (validateArguments()) {
	const method = process.argv[2].toLowerCase();
	const isRelease = (method === 'release');
	if (validateEnv(isRelease)) {
		let role;
		if (isRelease) {
			role = lambdaRole;
		} else {
			const awsResourceIds = require('../build/aws_resource_ids.json');
			role = getArn(awsResourceIds, 'LambdaRoleArn');
		}
		const apexProjectTemplate = {
			name: stackName,
			description: 'AWS Lambda Functions for Givesource app',
			memory: 128,
			timeout: 30,
			runtime: 'nodejs6.10',
			role: role,
			nameTemplate: '{{.Project.Name}}-{{.Function.Name}}'
		};
		const json = JSON.stringify(apexProjectTemplate, null, 2);
		mkdirp.sync(buildDirectory);
		fs.writeFileSync(`${buildDirectory}/project.json`, json);
		console.log('project.json created');
	}
}

// TODO: Add function overrides for lambda functions that need it
// createFunctionJson(lambdaRoleArn, 60, 512, [
// 	`${buildDirectory}/functions/CollectMetricsData`,
// 	`${buildDirectory}/functions/GetExternalMetrics`
// ]);