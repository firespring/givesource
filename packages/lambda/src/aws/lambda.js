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

/**
 * Lambda constructor
 *
 * @constructor
 */
function Lambda () {
}

/**
 * Create a new AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @param {String} handler
 * @param {String} role
 * @param {String} runtime
 * @param {{}} code
 * @param {{}} [env]
 * @return {Promise}
 */
Lambda.prototype.createFunction = function (region, functionName, handler, role, runtime, code, env) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      Code: code,
      FunctionName: functionName,
      Handler: handler,
      Role: role,
      Runtime: runtime
    }

    env = env || {}
    if (Object.keys(env).length) {
      params.Environment = {}
      params.Environment.Variables = env
    }

    awsLambda.createFunction(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * Delete an AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @return {Promise}
 */
Lambda.prototype.deleteFunction = function (region, functionName) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      FunctionName: functionName
    }
    awsLambda.deleteFunction(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * Get an AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @return {Promise}
 */
Lambda.prototype.getFunction = function (region, functionName) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      FunctionName: functionName
    }
    awsLambda.getFunction(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * Invoke an AWS Lambda function
 *
 * @param {String} region
 * @param {String} functionName
 * @param {{}} payload
 * @param {String} [invocationType]
 * @return {Promise}
 */
Lambda.prototype.invoke = function (region, functionName, payload, invocationType) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
      InvocationType: invocationType || 'Event'
    }
    awsLambda.invoke(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * Publish a new AWS Lambda function version
 *
 * @param {String} region
 * @param {String} functionName
 * @return {Promise}
 */
Lambda.prototype.publishVersion = function (region, functionName) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      FunctionName: functionName
    }
    awsLambda.publishVersion(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * Update an AWS Lambda function's code
 *
 * @param {String} region
 * @param {String} functionName
 * @param {*} zipFile
 * @return {Promise}
 */
Lambda.prototype.updateFunctionCode = function (region, functionName, zipFile) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      FunctionName: functionName,
      ZipFile: zipFile
    }
    awsLambda.updateFunctionCode(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * Update an AWS Lambda function's configuration (currently only Runtime supported)
 *
 * @param {String} region
 * @param {String} functionName
 * @param {*} runtime
 * @return {Promise}
 */
Lambda.prototype.updateFunctionConfiguration = function (region, functionName, runtime) {
  const awsLambda = new AWS.Lambda({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      FunctionName: functionName,
      Runtime: runtime
    }
    awsLambda.updateFunctionConfiguration(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

Lambda.prototype.waitFor = function (region, functionName) {
  const awsLambda = new AWS.Lambda({ region: region })

  // Has to wait for the function update status to transition to "Updated"
  // until making further re-configuration.
  // https://github.com/claudiajs/claudia/issues/226
  // https://aws.amazon.com/de/blogs/compute/coming-soon-expansion-of-aws-lambda-states-to-all-functions/
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html
  return awsLambda.waitFor('functionUpdated', {
    FunctionName: functionName
  }).promise()
}

module.exports = Lambda
