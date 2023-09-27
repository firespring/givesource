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
const packageJson = require('./../../../package.json')

const S3 = require('./aws/s3')
const Lambda = require('./aws/lambda')

const queryBuckets = async function () {
  const s3 = new S3()
  const regex = new RegExp(`^${config.stack.AWS_STACK_NAME.toLowerCase()}-`)

  return s3.listBuckets().then(function (thing) {
    const found = []
    thing.filter((object) => object.Name.match(regex)).forEach(function (it) {
      found.push(it.Name)
    })

    return found
  })
}

const queryLambdas = async function () {
  const lambda = new Lambda()
  const regex = new RegExp(`^${config.stack.AWS_STACK_NAME}-`)

  return lambda.listFunctions().then(function (thing) {
    console.log(thing)
    const found = []

    thing.filter((object) => object.FunctionName.match(regex)).forEach(function (it) {
      found.push(it.FunctionName)
    })
    return found
  })
}

async function check () {
  const foo = await queryBuckets()
  console.log(foo)
  const bar = await queryLambdas()
  console.log(bar)
//queryBuckets().then(function (response) {
//  console.log(response)
//}).catch(function (err) {
//  console.log(err)
//})
}

check()
