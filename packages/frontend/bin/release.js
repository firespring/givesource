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
const packageJson = require('../../../package.json');
const S3 = require('./aws/s3');

/**
 * Check if assets already exist for this version
 *
 * @return {Promise}
 */
const versionExists = function (project) {
	return new Promise(function (resolve, reject) {
		const s3 = new S3();
		const bucketName = config.get('release.AWS_RELEASE_BUCKET');
		const keyName = project + '/' + packageJson.version;
		s3.listObjects(config.get('release.AWS_RELEASE_BUCKET_REGION'), bucketName, keyName).then(function (objects) {
			if (objects.length) {
				reject(new Error('a release already exists: s3://' + bucketName + '/' + keyName));
			}
			resolve();
		});
	});
};

/**
 * Upload frontend assets to the release S3 bucket
 *
 * @param {String} sourcePath
 * @param {String} destinationPath
 * @param {[]} [exclude]
 * @return {Promise}
 */
const release = function (sourcePath, destinationPath, exclude) {
	exclude = Array.isArray(exclude) ? exclude : [];
	destinationPath = destinationPath.endsWith('/') ? destinationPath : destinationPath + '/';
	sourcePath = sourcePath.endsWith('/') ? sourcePath : sourcePath + '/';
	const files = fs.readdirSync(sourcePath, 'utf8').filter(function (filename) {
		return (filename.indexOf('.') > -1 && exclude.indexOf(filename) < 0);
	});

	const s3 = new S3();
	let promise = Promise.resolve();
	files.forEach(function (filename) {
		const filepath = path.join(sourcePath, filename);
		const objectName = destinationPath + filename;
		const body = fs.readFileSync(filepath);
		promise = promise.then(function () {
			return s3.putObject(config.get('release.AWS_RELEASE_BUCKET_REGION'), config.get('release.AWS_RELEASE_BUCKET'), objectName, body).then(function () {
				console.log('uploaded: s3://' + config.get('release.AWS_RELEASE_BUCKET') + '/' + objectName);
			});
		});
	});

	return promise;
};

let promise = Promise.resolve();
if (process.argv[2] !== '--force' && process.argv[2] !== '-F') {
	promise = promise.then(function () {
		return versionExists('admin-pages');
	}).then(function () {
		return versionExists('public-pages');
	});
}

const adminSource = path.resolve(__dirname, './../build/admin-pages') + '/';
const adminDestination = 'admin-pages/' + packageJson.version + '/';
const publicSource = path.resolve(__dirname, './../build/public-pages') + '/';
const publicDestination = 'public-pages/' + packageJson.version + '/';
promise = promise.then(function () {
	return release(adminSource, adminDestination, ['settings.json']);
}).then(function () {
	return release(adminSource + 'assets/css/', adminDestination + 'assets/css/');
}).then(function () {
	return release(adminSource + 'assets/img/', adminDestination + 'assets/img/');
}).then(function () {
	return release(publicSource, publicDestination, ['settings.json']);
}).then(function () {
	return release(publicSource + 'assets/css/', publicDestination + 'assets/css/');
}).then(function () {
	return release(publicSource + 'assets/img/', publicDestination + 'assets/img/');
}).then(function () {
	return release(publicSource + 'assets/temp/', publicDestination + 'assets/temp/');
}).then(function () {
	return release(publicSource + 'assets/temp/sponsors/', publicDestination + 'assets/temp/sponsors/');
}).then(function () {
	return release(publicSource + 'templates/', publicDestination + 'templates/');
}).then(function () {
	console.log('CloudFormation release complete.');
}).catch(function (err) {
	console.log(err);
});