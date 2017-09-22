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

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mkdirp = require('mkdirp');
const AWS = require('aws-sdk');

dotenv.config({path: `${__dirname}/../../../.env`});

/**
 * Describe stacks for a CloudFormation stack
 *
 * @param stackName
 * @return {Promise}
 */
const describeStack = function (stackName) {
	return new Promise(function (resolve, reject) {
		const awsRegion = process.env.AWS_REGION;
		const cloudFormation = new AWS.CloudFormation({region: awsRegion});
		const params = {StackName: stackName};
		cloudFormation.describeStacks(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			if (!data) {
				return reject(new Error('describeStacks returned no data'));
			}
			const stacks = data.Stacks;
			if (!stacks || stacks.length !== 1) {
				return reject(new Error('describeStacks unexpected number of stacks'));
			}
			resolve(stacks[0]);
		});
	});
};

/**
 * Get the Outputs from CloudFormation stacks
 *
 * @return {Promise}
 */
const getStackOutput = function () {
	return new Promise(function (resolve, reject) {
		const stackName = process.env.AWS_STACK_NAME;
		describeStack(stackName).then(function (stacks) {
			resolve(stacks.Outputs);
		}).catch(function (err) {
			reject(err);
		});
	});
};

getStackOutput().then(function (output) {
	return JSON.stringify(output, null, 2);
}).then(function (json) {
	const buildDir = path.normalize(`${__dirname}/../build`);
	mkdirp.sync(buildDir);
	fs.writeFileSync(`${buildDir}/aws_resource_ids.json`, json);
	console.log('aws_resource_ids.json created');
}).catch(function (err) {
	console.error(err, err.stack);
	process.exit(1);
});
