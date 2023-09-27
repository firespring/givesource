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
 * Lambda constructor
 *
 * @constructor
 */
function Lambda () {
}

/**
 * List AWS Lambda function
 *
 * @param {string} region
 * @param {string} bucketName
 * @param {string} prefix
 * @return {Promise}
 */

Lambda.prototype.listFunctions = function (region) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {}
    awsLambda.listFunctions(params, function (err, results) {
      if (err) {
        reject(err)
      }
      resolve(results.Functions)
    })
  })
}

module.exports = Lambda
