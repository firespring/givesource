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

const config = require('config')
const fs = require('fs')
const mkdirp = require('mkdirp')
const mustache = require('mustache')
const packageJson = require('./../../../package.json')

/**
 * Create CloudFormation yaml file from templates
 */
const build = function () {
  const data = {
    version: packageJson.version,
    awsReleaseBucket: config.get('release.AWS_RELEASE_BUCKET'),
    awsReleaseBucketRegion: config.get('release.AWS_RELEASE_BUCKET_REGION'),
    awsLambdaReleaseBucketPrefix: config.get('release.AWS_LAMBDA_RELEASE_BUCKET_PREFIX')
  }
  const buildDir = path.resolve(__dirname, './../build')
  const templatesDir = path.resolve(__dirname, './../templates/')
  const templates = fs.readdirSync(templatesDir, 'utf8').filter(function (filename) {
    return filename.indexOf('.') > -1
  })

  mkdirp.sync(buildDir)
  templates.forEach(function (filename) {
    const template = fs.readFileSync(templatesDir + '/' + filename, 'utf8')
    const rendered = mustache.render(template, data)
    fs.writeFileSync(buildDir + '/' + filename, rendered)
  })
}

build()
