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

require('./config/bootstrap').bootstrap()

const config = require('config')
const fs = require('fs')
const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
const Lambda = require('./../src/aws/lambda')
const path = require('path')

/**
 * Deploy a lambda function
 *
 * @param {String} functionName
 * @return {Promise}
 */
const deploy = function (functionName) {
  const lambda = new Lambda()

  const buildDir = path.resolve(__dirname, './../build')
  const name = config.get('stack.AWS_STACK_NAME') + '-' + functionName

  return lambda.getFunction(config.get('stack.AWS_REGION'), name).then(function () {
    const filepath = buildDir + '/' + functionName + '.zip'
    const body = fs.readFileSync(filepath)
    const zip = Buffer.from(body, 'binary')
    return lambda.updateFunctionCode(config.get('stack.AWS_REGION'), name, zip)
  })
}

/**
 * Batch deploy all lambda functions
 *
 * @param {[]} functions
 * @param {int} [retries]
 * @return {Promise}
 */
const batchDeploy = function (functions, retries) {
  retries = (retries > -1) ? retries : 3
  return new Promise(function (resolve, reject) {
    const failed = []
    let promise = Promise.resolve()
    functions.forEach(function (func) {
      promise = promise.then(function () {
        return deploy(func).then(function () {
          console.log('deployed ' + func)
        }).catch(function (err) {
          console.log(err)
          failed.push(func)
        })
      })
    })
    promise = promise.then(function () {
      if (failed.length > 0) {
        if (retries > 0) {
          retries = retries - 1
          return batchDeploy(failed, retries)
        } else {
          reject(new Error('Failed to deploy: ' + JSON.stringify(failed)))
        }
      } else {
        resolve()
      }
    })
  })
}

const functionsDir = path.resolve(__dirname, './../build/functions')
const list = fs.readdirSync(functionsDir)
const choices = ['All'].concat(list)

const searchFunctions = function (answers, input) {
  input = input || ''
  return new Promise(function (resolve) {
    const results = fuzzy.filter(input, choices)
    resolve(results.map(function (el) {
      return el.original
    }))
  })
}

let lambdasToDeploy

if (process.env.LAMBDA) {
  if (!list.includes(process.env.LAMBDA)) {
    throw new Error(`"${process.env.LAMBDA}" is not a valid lambda`)
  }
  lambdasToDeploy = Promise.resolve([process.env.LAMBDA])
} else {
  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
  lambdasToDeploy = inquirer.prompt([
    {
      type: 'autocomplete',
      message: 'Select a function to deploy:',
      name: 'selected',
      source: searchFunctions,
      validate: function (answer) {
        if (answer.length < 1) {
          return 'C'
        }
        return true
      }
    }
  ]).then(function (answer) {
    return (answer.selected === 'All') ? list : [answer.selected]
  })
}

lambdasToDeploy.then(async (functions) => {
  await batchDeploy(functions)
}).catch(function (err) {
  console.log(err)
})
