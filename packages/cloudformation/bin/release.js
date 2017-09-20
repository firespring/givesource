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
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const packageJson = require('./../../../package.json');

dotenv.config({path: `${__dirname}/../../../.env`});

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