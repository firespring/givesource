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

import { createRequire } from 'node:module'
import path from 'path'
import { fileURLToPath } from 'url'
import S3 from './aws/s3.js'
const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, './../../../.env') })
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, './../../../config/')

const config = require('config')
const fs = require('fs')
const packageJson = require('../../../package.json')

/**
 * Check if assets already exist for this version
 *
 * @return {Promise}
 */
const versionExists = function (project) {
  return new Promise(function (resolve, reject) {
    const s3 = new S3()
    const bucketName = config.get('release.AWS_RELEASE_BUCKET')
    const keyName = project + '/' + packageJson.version
    s3.listObjects(config.get('release.AWS_RELEASE_BUCKET_REGION'), bucketName, keyName).then(function (objects) {
      if (objects.length) {
        reject(new Error('a release already exists: s3://' + bucketName + '/' + keyName))
      }
      resolve()
    })
  })
}

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
 * Upload frontend assets to the release S3 bucket
 *
 * @param {String} sourcePath
 * @param {String} destinationPath
 * @param {[]} [exclude]
 * @return {Promise}
 */
const release = function (sourcePath, destinationPath, exclude) {
  exclude = Array.isArray(exclude) ? exclude : []
  destinationPath = destinationPath.endsWith('/') ? destinationPath : destinationPath + '/'
  sourcePath = sourcePath.endsWith('/') ? sourcePath : sourcePath + '/'
  const files = walkSyncRelative(sourcePath).filter(function (filename) {
    return (filename.indexOf('.') > -1 && exclude.indexOf(filename) < 0)
  })

  const s3 = new S3()
  let promise = Promise.resolve()
  files.forEach(function (filename) {
    const filepath = path.join(sourcePath, filename)
    const objectName = destinationPath + filename
    const body = fs.readFileSync(filepath)
    promise = promise.then(function () {
      return s3.putObject(config.get('release.AWS_RELEASE_BUCKET_REGION'), config.get('release.AWS_RELEASE_BUCKET'), objectName, body).then(function () {
        console.log('uploaded: s3://' + config.get('release.AWS_RELEASE_BUCKET') + '/' + objectName)
      })
    })
  })

  return promise
}

let promise = Promise.resolve()
if (process.argv[2] !== '--force' && process.argv[2] !== '-F') {
  promise = promise.then(function () {
    return versionExists('admin-pages')
  }).then(function () {
    return versionExists('public-pages')
  })
}

const adminSource = path.resolve(__dirname, './../build/admin-pages') + '/'
const adminDestination = 'admin-pages/' + packageJson.version + '/'
const publicSource = path.resolve(__dirname, './../build/public-pages') + '/'
const publicDestination = 'public-pages/' + packageJson.version + '/'
promise.then(function () {
  return release(adminSource, adminDestination, ['settings.json'])
}).then(function () {
  return release(publicSource, publicDestination, ['settings.json'])
}).then(function () {
  console.log('Frontend release complete.')
}).catch(function (err) {
  console.log(err)
})
