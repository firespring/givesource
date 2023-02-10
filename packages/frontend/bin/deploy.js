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

const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, './../../../.env') })
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, './../../../config/')

const _ = require('lodash')
const config = require('config')
const deployInfo = require('../config/deploy-info.json')
const fs = require('fs')
const S3 = require('./aws/s3')

/**
 * Get a list of files recursively from a directory
 * Returns absolute path of each file in an array
 *
 * @param {string} dir
 * @param {Array} fileList
 * @return {Array}
 */
const walkSync = function (dir, fileList) {
  fileList = fileList || []
  const files = fs.readdirSync(dir, 'utf8')
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = walkSync(path.join(dir, file), fileList)
    } else {
      fileList.push(path.join(dir, file))
    }
  })

  return fileList
}

/**
 * Get a list of files recursively from a directory
 * Returns relative path of each file in an array
 *
 * @param {string} dir
 * @return {Array}
 */
const walkSyncRelative = function (dir) {
  return walkSync(dir).map(function (file) {
    if (file.indexOf(dir) === 0) {
      return file.slice(dir.length)
    } else {
      return file
    }
  })
}

/**
 * Upload a directory recursively to AWS S3
 *
 * @param {string} dir
 * @param {string} bucket
 * @param {string} region
 * @param {array} [exclude]
 * @return {Promise}
 */
const deploy = function (dir, bucket, region, exclude) {
  const s3 = new S3()
  const files = walkSyncRelative(dir)
  exclude = Array.isArray(exclude) ? exclude : []

  let promise = Promise.resolve()
  files.forEach(function (file) {
    const key = file.indexOf('/') === 0 ? file.slice(1) : file
    if (!(exclude.indexOf(key) > -1)) {
      const object = fs.readFileSync(path.join(dir, file))

      promise = promise.then(() => {
        return s3.putObject(region, bucket, key, object)
      }).then(() => {
        console.log('uploaded: ' + key)
      })
    }
  })

  return promise
}

// Run the deploy
Promise.all([
  deploy(path.normalize(__dirname + '/../build/admin-pages'), deployInfo.AdminPagesS3BucketName, config.get('stack.AWS_REGION')),
  deploy(path.normalize(__dirname + '/../build/public-pages'), deployInfo.PublicPagesS3BucketName, config.get('stack.AWS_REGION'))
]).then(() => {
  console.log('deployed frontend')
}).catch(err => {
  console.log(err)
})
