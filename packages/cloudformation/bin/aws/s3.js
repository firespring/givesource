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

const AWS = require('aws-sdk')
const mime = require('mime')

/**
 * S3 constructor
 *
 * @constructor
 */
function S3 () {
}

/**
 * List AWS S3 buckets
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} prefix
 * @return {Promise}
 */
S3.prototype.listBuckets = function (region) {
  const awsS3 = new AWS.S3({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {}
    awsS3.listBuckets(params, function (err, results) {
      if (err) {
        reject(err)
      }
      resolve(results.Buckets)
    })
  })
}

/**
 * List AWS S3 objects
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} prefix
 * @return {Promise}
 */
S3.prototype.listObjects = function (region, bucketName, prefix) {
  const awsS3 = new AWS.S3({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      Bucket: bucketName,
      Prefix: prefix
    }
    awsS3.listObjectsV2(params, function (err, results) {
      if (err) {
        reject(err)
      }
      resolve(results.Contents)
    })
  })
}

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
  const awsS3 = new AWS.S3({ region: region })
  return new Promise(function (resolve, reject) {
    contentType = contentType || mime.getType(objectName)
    const params = {
      Bucket: bucketName,
      Body: body,
      Key: objectName,
      ContentType: contentType
    }
    if (contentDisposition) {
      params.ContentDisposition = contentDisposition
    }
    awsS3.putObject(params, function (err) {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

module.exports = S3
