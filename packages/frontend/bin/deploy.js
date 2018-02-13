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
const deployInfo = require('../config/deploy-info.json');
const fs = require('fs');
const Lambda = require('./aws/lambda');
const path = require('path');
const S3 = require('./aws/s3');

dotenv.config({path: `${__dirname}/../../../.env`});
const awsRegion = process.env.AWS_REGION;

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function () {
	const missing = [];
	const required = {
		AWS_REGION: awsRegion,
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
	assetPath = assetPath ? `assets/${assetPath}/` : '';

	return new Promise(function (resolve, reject) {
		const path = `${assetPath}`;

		S3.uploadDirectory(src, awsRegion, bucket, path, exclude).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

if (validateEnv()) {
	const adminPagesDir = path.normalize(`${__dirname}/../build/admin-pages`);
	const adminPagesCssDir = path.normalize(`${adminPagesDir}/assets/css`);
	const adminPagesImgDir = path.normalize(`${adminPagesDir}/assets/img`);
	const adminPagesBucket = deployInfo.adminPagesS3BucketName;

	const publicPagesDir = path.normalize(`${__dirname}/../build/public-pages`);
	const publicPagesCssDir = path.normalize(`${publicPagesDir}/assets/css`);
	const publicPagesImgDir = path.normalize(`${publicPagesDir}/assets/img`);
	const publicPagesIndexTemplateFile = path.normalize(`${publicPagesDir}/templates/index.mustache`);
	const publicPagesTempDir = path.normalize(`${publicPagesDir}/assets/temp`);
	const publicPagesSponsorsDir = path.normalize(`${publicPagesDir}/assets/temp/sponsors`);
	const publicPagesBucket = deployInfo.publicPagesS3BucketName;

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

	lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SaveSettings', lambdaRequestBody, 'RequestResponse').then(function () {
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-GeneratePublicIndexFile', {}, 'RequestResponse').then(function () {
			console.log('Generated public-pages index.html');
		});
	}).catch(function (err) {
		console.log(err);
	});

}