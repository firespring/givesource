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

const AWS = require('aws-sdk');
const mime = require('mime');

/**
 * S3 constructor
 *
 * @constructor
 */
function S3() {
}

/**
 * Get an object from AWS S3
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} objectName
 * @return {Promise}
 */
S3.prototype.getObject = function (region, bucketName, objectName) {
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

/**
 * Put an object on AWS S3
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} objectName
 * @param {*} body
 * @param {String} [contentType]
 * @param {String} [contentDisposition]
 * @return {Promise}
 */
S3.prototype.putObject = function (region, bucketName, objectName, body, contentType, contentDisposition) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		contentType = contentType ? contentType : mime.lookup(objectName);
		const params = {
			Bucket: bucketName,
			Body: body,
			Key: objectName,
			ContentType: contentType
		};

		if (contentDisposition) {
			params['ContentDisposition'] = contentDisposition;
		}

		awsS3.putObject(params, function (err) {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
};

/**
 * Delete an object on AWS S3
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} objectName
 * @return {Promise}
 */

S3.prototype.deleteObject = function (region, bucketName, objectName) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Key: objectName
		};
		awsS3.deleteObject(params, function (err) {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
};

/**
 * List AWS S3 objects
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} prefix
 * @return {Promise}
 */
S3.prototype.listObjects = function (region, bucketName, prefix) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Prefix: prefix
		};
		awsS3.listObjectsV2(params, function (err, results) {
			if (err) {
				reject(err);
			}
			resolve(results.Contents);
		});
	});
};

/**
 * Copy object from one AWS S3 bucket to another
 *
 * @param {string} region
 * @param {string} srcBucketName
 * @param {string} srcObjectName
 * @param {string} destBucketName
 * @param {string} destObjectName
 * @return {Promise}
 */
S3.prototype.copyObject = function (region, srcBucketName, srcObjectName, destBucketName, destObjectName) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const contentType = mime.lookup(destObjectName);
		const params = {
			Bucket: destBucketName,
			Key: destObjectName,
			ContentType: contentType,
			CopySource: srcBucketName + '/' + srcObjectName
		};
		awsS3.copyObject(params, function (err, result) {
			if (err) {
				reject(err);
			}
			console.log('copied: ' + destObjectName);
			resolve();
		});
	});
};

/**
 * Get a signed AWS S3 url for file uploads
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} filePath
 * @param {string} contentType
 * @return {Promise}
 */
S3.prototype.getSignedUrl = function (region, bucketName, filePath, contentType) {
	const awsS3 = new AWS.S3({region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Key: filePath,
			Expires: 3600,
			ContentType: contentType
		};
		awsS3.getSignedUrl('putObject', params, function (err, url) {
			if (err) {
				reject(err);
			}
			resolve(url);
		});
	});
};

module.exports = S3;