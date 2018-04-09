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

const _ = require('lodash');
const config = require('config');
const deployInfo = require('../config/deploy-info.json');
const fs = require('fs');
const Lambda = require('./aws/lambda');
const S3 = require('./aws/s3');

const uploadDirectory = function (directory, region, bucketName, objectNamePrefix, exclude) {
	const s3 = new S3();
	exclude = Array.isArray(exclude) ? exclude : [];
	objectNamePrefix = objectNamePrefix || '';
	const files = fs.readdirSync(directory, 'utf8').filter(function (filename) {
		return (filename.indexOf('.') > -1 && _.indexOf(exclude, filename) === -1);
	});
	let promise = Promise.resolve();
	files.forEach(function (filename) {
		const filepath = path.join(directory, filename);
		const objectName = objectNamePrefix + filename;
		const body = fs.readFileSync(filepath);
		promise = promise.then(function () {
			return s3.putObject(region, bucketName, objectName, body);
		});
	});

	return promise;
};

/**
 * Deploy front-end assets to a stack
 *
 * @param {String} project
 * @param {String} src
 * @param {String} assetPath
 * @param {String} bucket
 * @param {array} exclude
 * @return {Promise}
 */
const deploy = function (project, src, assetPath, bucket, exclude) {
	assetPath = assetPath ? 'assets/' + assetPath + '/' : '';
	return uploadDirectory(src, config.get('stack.AWS_REGION'), bucket, assetPath, exclude);
};

const adminPagesDir = path.normalize(`${__dirname}/../build/admin-pages`);
const adminPagesCssDir = path.normalize(`${adminPagesDir}/assets/css`);
const adminPagesImgDir = path.normalize(`${adminPagesDir}/assets/img`);
const adminPagesBucket = deployInfo.AdminPagesS3BucketName;

const publicPagesDir = path.normalize(`${__dirname}/../build/public-pages`);
const publicPagesCssDir = path.normalize(`${publicPagesDir}/assets/css`);
const publicPagesImgDir = path.normalize(`${publicPagesDir}/assets/img`);
const publicPagesIndexTemplateFile = path.normalize(`${publicPagesDir}/templates/index.mustache`);
const publicPagesTempDir = path.normalize(`${publicPagesDir}/assets/temp`);
const publicPagesSponsorsDir = path.normalize(`${publicPagesDir}/assets/temp/sponsors`);
const publicPagesBucket = deployInfo.PublicPagesS3BucketName;

deploy('admin-pages', adminPagesDir, '', adminPagesBucket).then(function () {
	return deploy('admin-pages', adminPagesCssDir, 'css', adminPagesBucket);
}).then(function () {
	return deploy('admin-pages', adminPagesImgDir, 'img', adminPagesBucket);
}).then(function () {
	console.log('deployed admin-pages');
}).catch(function (err) {
	console.log(err);
});

deploy('public-pages', publicPagesDir, '', publicPagesBucket, ['index.html']).then(function () {
	return deploy('public-pages', publicPagesCssDir, 'css', publicPagesBucket);
}).then(function () {
	return deploy('public-pages', publicPagesImgDir, 'img', publicPagesBucket);
}).then(function () {
	return deploy('public-pages', publicPagesTempDir, 'temp', publicPagesBucket);
}).then(function () {
	return deploy('public-pages', publicPagesSponsorsDir, 'temp/sponsors', publicPagesBucket);
}).then(function () {
	console.log('deployed public-pages');
}).catch(function (err) {
	console.log(err);
});

const lambda = new Lambda();
let lambdaRequestBody = {
	ResourceProperties: {
		Settings: JSON.stringify({PUBLIC_INDEX_TEMPLATE: fs.readFileSync(publicPagesIndexTemplateFile).toString()})
	}
};

lambda.invoke(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME') + '-SaveSettings', lambdaRequestBody, 'RequestResponse').then(function () {
	return lambda.invoke(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME') + '-GeneratePublicIndexFile', {}, 'RequestResponse');
}).then(function () {
	console.log('Generated public-pages index.html');
}).catch(function (err) {
	console.log(err);
});