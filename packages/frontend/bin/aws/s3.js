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

const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const _ = require('lodash');

exports.uploadFile = function (filepath, region, bucketName, objectName) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const contentType = mime.lookup(objectName);
		const params = {
			Bucket: bucketName,
			Body: fs.readFileSync(filepath),
			Key: objectName,
			ContentType: contentType
		};
		awsS3.putObject(params, function (err, result) {
			if (err) {
				reject(err);
				return;
			}
			console.log(`uploaded: ${filepath}`);
			resolve();
		});
	});
};

exports.uploadDirectory = function (directory, region, bucketName, objectNamePrefix, exclude) {
	const S3 = this;
	if (!_.isArray(exclude)) {
		exclude = [];
	}
	return new Promise(function (resolve, reject) {
		objectNamePrefix = objectNamePrefix || '';
		const files = fs.readdirSync(directory, 'utf8').filter(function (filename) {
			return (filename.indexOf('.') > -1 && _.indexOf(exclude, filename) === -1);
		});
		let promise = Promise.resolve();
		files.forEach(function (filename) {
			const filepath = path.join(directory, filename);
			const objectName = objectNamePrefix + filename;
			promise = promise.then(function () {
				return S3.uploadFile(filepath, region, bucketName, objectName).catch(function (err) {
					reject(err);
				});
			});
		});
		promise = promise.then(function () {
			resolve();
		});
	});
};

exports.listObjects = function (region, bucketName, path) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Prefix: path
		};
		awsS3.listObjectsV2(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			return resolve(result.Contents);
		});
	})
};

exports.deleteObjects = function (region, bucketName, objectKeys) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Delete: {
				Objects: []
			}
		};
		objectKeys.forEach(function (objectKey) {
			params.Delete.Objects.push({
				Key: objectKey.Key
			})
		});
		awsS3.deleteObjects(params, function (err, result) {
			if (err) {
				return reject(err)
			}
			result.Deleted.forEach((obj) => {
				console.log('deleted: ' + obj.Key)
			});
			return resolve();
		});
	});
};

/**
 * Get an object from AWS S3
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} objectName
 * @return {Promise}
 */
exports.getObject = function (region, bucketName, objectName) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Key: objectName
		};
		awsS3.getObject(params, function (err, result) {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
};