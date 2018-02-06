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
const fs = require('fs');
const mime = require('mime');
const path = require('path');

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

exports.uploadDirectory = function (directory, region, bucketName, objectNamePrefix) {
	const S3 = this;
	return new Promise(function (resolve, reject) {
		objectNamePrefix = objectNamePrefix || '';
		const files = fs.readdirSync(directory, 'utf8').filter(function (filename) {
			return filename.indexOf('.') > -1;
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