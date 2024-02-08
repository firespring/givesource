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

const SSM = require('../../aws/ssm')
const S3 = require('../../aws/s3')

const s3 = new S3()
const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(process.env.AWS_REGION + '.', '').replace('us-east-1.', '')

/**
 * Get the config ({AWS_STACK_REGION: ,AWS_S3_BUCKET_NAME: ,AWS_STACK_NAME: }) from parameter store
 * memoizes the config to prevent un-needed lookups
 * @type {function(): Promise<any>}
 */
const getConfig = (() => {
  let configPromise
  function getConfig () {
    if (!configPromise) {
      configPromise = (new SSM())
        .getParameter('us-east-1', '/' + functionName + '/config')
        .then(response => JSON.parse(response.Parameter.Value))
    }

    return configPromise
  }
  return getConfig
})()

/**
 * Get the body content of the s3 object
 * @param objectPath {string}
 * @returns {Promise<string>}
 */
async function getS3Body (objectPath) {
  const config = await getConfig()
  const s3Object = await s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, objectPath)
  return s3Object.Body.toString()
}

/**
 * Iterates of the list of paths of returns the body of the first one that exists
 * generally provided a nonprofit specific url, then site configured (default), then base default
 * @param paths {string[]}
 * @returns {Promise<string>}
 */
async function getFirstMatchFromS3 (paths) {
  let body
  for (const path of paths) {
    try {
      body = await getS3Body(path)
      if (body) {
        return body
      }
    } catch (e) {
      // continue trying next path
      // console.log(path, ' not found. continue', e)
    }
  }
}

module.exports = { getFirstMatchFromS3 }
