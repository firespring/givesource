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
const packageJson = require('../../../package.json');
const path = require('path');
const S3 = require('./aws/s3');

dotenv.config({path: `${__dirname}/../../../.env`});

const awsReleaseBucket = process.env.AWS_RELEASE_BUCKET;
const awsReleaseBucketRegion = process.env.AWS_RELEASE_BUCKET_REGION;

/**
 * Validate the environment variables
 *
 * @return {boolean}
 */
const validateEnv = function () {
	const missing = [];
	const required = {
		AWS_RELEASE_BUCKET: awsReleaseBucket,
		AWS_RELEASE_BUCKET_REGION: awsReleaseBucketRegion
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
 * Create a release
 *
 * @param {String} project
 * @param {String} src
 * @param {String} [relativePath]
 * @param {boolean} [force]
 */
const release = function (project, src, relativePath, force) {
	relativePath = relativePath ? `${relativePath}/` : '';
	force = (typeof force === 'boolean') ? force : false;

	return new Promise(function (resolve, reject) {
		const path = `${project}/${packageJson.version}/${relativePath}`;

		S3.listObjects(awsReleaseBucketRegion, awsReleaseBucket, path).then(function (objects) {
			if (objects.length !== 0) {
				if (!force) {
					return reject(new Error(`object already exist under ${path}`));
				}
				S3.deleteObjects(awsReleaseBucketRegion, awsReleaseBucket, objects).then(function () {
					return S3.uploadDirectory(src, awsReleaseBucketRegion, awsReleaseBucket, path);
				}).then(function () {
					return S3.deleteObjects(awsReleaseBucketRegion, awsReleaseBucket, [{Key: `${project}/${packageJson.version}/settings.json`}]);
				}).then(function () {
					resolve();
				}).catch(function (err) {
					reject(err);
				});
			} else {
				S3.uploadDirectory(src, awsReleaseBucketRegion, awsReleaseBucket, path).then(function () {
					return S3.deleteObjects(awsReleaseBucketRegion, awsReleaseBucket, [{Key: `${project}/${packageJson.version}/settings.json`}]);
				}).then(function () {
					resolve();
				}).catch(function (err) {
					reject(err);
				});
			}
		});
	});
};

if (validateEnv()) {
	const force = (process.argv[2] === '--force' || process.argv[2] === '-F');

	const adminPagesDir = path.normalize(`${__dirname}/../build/admin-pages`);
	const adminPagesCssDir = path.normalize(`${adminPagesDir}/assets/css`);
	const adminPagesImgDir = path.normalize(`${adminPagesDir}/assets/img`);

	const publicPagesDir = path.normalize(`${__dirname}/../build/public-pages`);
	const publicPagesCssDir = path.normalize(`${publicPagesDir}/assets/css`);
	const publicPagesImgDir = path.normalize(`${publicPagesDir}/assets/img`);
	const publicPagesTempDir = path.normalize(`${publicPagesDir}/assets/temp`);
	const publicPagesTemplatesDir = path.normalize(`${publicPagesDir}/templates`);
	const publicPagesSponsorsDir = path.normalize(`${publicPagesDir}/assets/temp/sponsors`);

	release('admin-pages', adminPagesDir, '', force).then(function () {
		return release('admin-pages', adminPagesCssDir, 'assets/css', force);
	}).then(function () {
		return release('admin-pages', adminPagesImgDir, 'assets/img', force);
	}).then(function () {
		console.log('released admin-pages');
	}).catch(function (err) {
		console.log(err);
	});

	release('public-pages', publicPagesDir, '', force).then(function () {
		return release('public-pages', publicPagesCssDir, 'assets/css', force);
	}).then(function () {
		return release('public-pages', publicPagesImgDir, 'assets/img', force);
	}).then(function () {
		return release('public-pages', publicPagesTempDir, 'assets/temp', force);
	}).then(function () {
		return release('public-pages', publicPagesSponsorsDir, 'assets/temp/sponsors', force);
	}).then(function () {
		return release('public-pages', publicPagesTemplatesDir, 'templates', force);
	}).then(function () {
		console.log('released public-pages');
	}).catch(function (err) {
		console.log(err);
	});
}