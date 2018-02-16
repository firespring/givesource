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

const execSync = require('child_process').execSync;
const packageJson = require('./../../../package.json');

const adminEmail = process.env.ADMIN_EMAIL;
const awsRegion = process.env.AWS_REGION;
const awsStackName = process.env.AWS_STACK_NAME;
const awsReleaseBucket = process.env.AWS_RELEASE_BUCKET;
const awsReleaseBucketRegion = process.env.AWS_RELEASE_BUCKET_REGION;

/**
 * Validate the incoming arguments
 *
 * @return {boolean}
 */
const validateArguments = function () {
	const valid = ['create', 'update', 'delete'];
	if (process.argv.length >= 3) {
		if (valid.indexOf(process.argv[2].toLowerCase()) > -1) {
			return true;
		}
	}
	console.error('Usage: stack.js [create|update|delete]');
	process.exit(1);
};

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function () {
	const missing = [];
	const required = {
		ADMIN_EMAIL: adminEmail,
		AWS_REGION: awsRegion,
		AWS_STACK_NAME: awsStackName,
		AWS_RELEASE_BUCKET: awsReleaseBucket,
		AWS_RELEASE_BUCKET_REGION: awsReleaseBucketRegion,
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
 * Create or update CloudFormation stack on AWS
 *
 * @param {String} action
 */
const putStack = function (action) {
	const url = `https://s3-${awsReleaseBucketRegion}.amazonaws.com/${awsReleaseBucket}/cf-templates/${packageJson.version}/givesource.yml`;
	const command = `aws cloudformation ${action} --region ${awsRegion} --stack-name ${awsStackName} --template-url ${url} --capabilities CAPABILITY_IAM ` +
		`--parameters ParameterKey=AdminEmail,ParameterValue=${adminEmail},UsePreviousValue=false`;
	const options = {
		maxBuffer: 100 * 1024 * 1024,
		stdio: [0, 1, 2]
	};
	execSync(command, options);
};

/**
 * Delete CloudFormation stack on AWS
 */
const deleteStack = function () {
	const command = `aws cloudformation delete-stack --region ${awsRegion} --stack-name ${awsStackName}`;
	const options = {
		stdio: [0, 1, 2]
	};
	execSync(command, options);
};

if (validateArguments() && validateEnv()) {
	const action = process.argv[2].toLowerCase();
	switch (action) {
		case 'create':
			putStack('create-stack');
			break;

		case 'update':
			putStack('update-stack');
			break;

		case 'delete':
			deleteStack();
			break;
	}
}