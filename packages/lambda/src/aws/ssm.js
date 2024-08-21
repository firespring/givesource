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
 * SSM Constructor
 *
 * @constructor
 */
function SSM () {
}

/**
 * Get a parameter from AWS SSM parameter store
 *
 * @param {String} region
 * @param {String} name
 * @param {bool} [decryption]
 * @return {Promise}
 */
SSM.prototype.getParameter = (region, name, decryption) => {
  const awsSSM = new AWS.SSM({ region: region })
  decryption = decryption || false
  const params = {
    Name: name,
    WithDecryption: decryption
  }
  return awsSSM.getParameter(params).promise()
}

/**
 * Get parameters from AWS SSM parameter store
 *
 * @param region
 * @param names
 * @param decryption
 * @returns {*}
 */
SSM.prototype.getParameters = (region, names, decryption) => {
  const awsSSM = new AWS.SSM({ region: region })
  decryption = decryption || false
  const params = {
    Names: names,
    WithDecryption: decryption
  }
  return awsSSM.getParameters(params).promise()
}

/**
 * Update a parameter in AWS SSM parameter store
 *
 * @param {String} region
 * @param {String} name
 * @param {String} value
 * @param {String} [type]
 * @param {String} [keyId]
 * @param {bool} [overwrite]
 * @return {Promise}
 */

SSM.prototype.putParameter = (region, name, value, type, keyId, overwrite) => {
  const awsSSM = new AWS.SSM({ region: region })
  if (!type) {
    type = keyId ? 'SecureString' : 'String'
  }
  overwrite = overwrite || true
  const params = {
    Name: name,
    Type: type,
    Value: value,
    Overwrite: overwrite
  }
  if (keyId) {
    params.KeyId = keyId
  }
  return awsSSM.putParameter(params).promise()
}

/**
 * Delete a parameter in AWS SSM parameter store
 *
 * @param {String} region
 * @param {String} name
 * @return {Promise}
 */
SSM.prototype.deleteParameter = (region, name) => {
  const awsSSM = new AWS.SSM({ region: region })
  return awsSSM.deleteParameter({ Name: name }).promise()
}

module.exports = SSM
