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
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, './../../../.env') })
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, './../../../config/')

const _ = require('lodash')
const config = require('config')
import CloudFormation from './aws/cloudFormation.js'
const fs = require('fs')

/**
 * Get output key from stack
 *
 * @param {{}} outputs
 * @param {String} outputKey
 * @return {*}
 */
const findOutputKey = (outputs, outputKey) => {
  const output = _.find(outputs, { OutputKey: outputKey })
  if (output && output.OutputValue) {
    return output.OutputValue
  } else {
    throw new Error(outputKey + ' not found')
  }
}

/**
 * Get Stack settings
 *
 * @return {Promise}
 */
const getSettings = () => {
  const cloudFormation = new CloudFormation()
  return cloudFormation.describeStacks(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME')).then(stacks => {
    if (stacks.length !== 1) {
      return Promise.reject(new Error('unexpected number of stacks'))
    } else {
      const stack = stacks[0]
      return Promise.resolve({
        API_URL: findOutputKey(stack.Outputs, 'ApiUrl'),
        AdminPagesCloudFrontDistribution: findOutputKey(stack.Outputs, 'AdminPagesCloudFrontDistribution'),
        AdminPagesS3BucketName: findOutputKey(stack.Outputs, 'AdminPagesS3BucketName'),
        AdminPagesS3BucketUrl: findOutputKey(stack.Outputs, 'AdminPagesS3BucketUrl'),
        PublicPagesCloudFrontDistribution: findOutputKey(stack.Outputs, 'PublicPagesCloudFrontDistribution'),
        PublicPagesS3BucketName: findOutputKey(stack.Outputs, 'PublicPagesS3BucketName'),
        PublicPagesS3BucketUrl: findOutputKey(stack.Outputs, 'PublicPagesS3BucketUrl'),
        UploadsCloudFrontDistribution: findOutputKey(stack.Outputs, 'UploadsCloudFrontDistribution')
      })
    }
  }).catch(err => {
    // This can happen when the app hasn't been created yet - so continue instead of erroring
    console.log(err)
    return {}
  })
}

/**
 * Write config file
 *
 * @param {String} filename
 * @param {{}} data
 */
const writeConfig = (filename, data) => {
  const jsonData = JSON.stringify(data, null, 2)
  const filePath = path.resolve(__dirname, './../config/' + filename)
  fs.writeFileSync(filePath, jsonData)
  console.log(filename + ' created')
}

getSettings().then(data => {
  const settings = {
    API_URL: null
  }
  const deployInfo = {
    AdminPagesCloudFrontDistribution: null,
    AdminPagesS3BucketName: null,
    AdminPagesS3BucketUrl: null,
    PublicPagesCloudFrontDistribution: null,
    PublicPagesS3BucketName: null,
    PublicPagesS3BucketUrl: null,
    UploadsCloudFrontDistribution: null
  }
  Object.keys(data).forEach(key => {
    if (settings.hasOwnProperty(key)) {
      settings[key] = data[key]
    }
    if (deployInfo.hasOwnProperty(key)) {
      deployInfo[key] = data[key]
    }
  })

  writeConfig('settings.json', settings)
  writeConfig('deploy-info.json', deployInfo)
}).catch(err => {
  console.log(err)
})
