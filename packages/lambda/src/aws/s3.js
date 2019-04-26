/*
 * Copyright 2019 Firespring, Inc.
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
	const awsS3 = new AWS.S3({region: region});
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
S3.prototype.putObject = function (region, bucketName, objectName, body, acl, contentType, contentDisposition) {
	const awsS3 = new AWS.S3({region: region});
	return new Promise(function (resolve, reject) {
		contentType = contentType ? contentType : mime.getType(objectName);
		const params = {
			Bucket: bucketName,
			Body: body,
			Key: objectName,
			ContentType: contentType
		};

		if (acl) {
			params['ACL'] = acl;
		}

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
	const awsS3 = new AWS.S3({region: region});
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
	const awsS3 = new AWS.S3({region: region});
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
	const awsS3 = new AWS.S3({region: region});
	return new Promise(function (resolve, reject) {
		const contentType = mime.getType(destObjectName);
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
 * @param {string} [acl]
 * @return {Promise}
 */
S3.prototype.getSignedUrl = function (region, bucketName, filePath, contentType, acl) {
	const awsS3 = new AWS.S3({region: region});
	return new Promise(function (resolve, reject) {
		const params = {
			Bucket: bucketName,
			Key: filePath,
			Expires: 3600,
			ContentType: contentType
		};
		if (acl) {
			params['ACL'] = acl;
		}
		awsS3.getSignedUrl('putObject', params, function (err, url) {
			if (err) {
				reject(err);
			}
			resolve(url);
		});
	});
};

module.exports = S3;