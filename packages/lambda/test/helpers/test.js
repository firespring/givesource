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

// Set timezone to UTC for consistency in tests
process.env.TZ = 'UTC'

const assert = require('assert')
const Generator = require('./../../src/helpers/generator')
const promiseMe = require('mocha-promise-me')

/**
 * Load the Generator
 *
 * @type {Generator}
 */
const generatorInstance = new Generator()
module.exports.generate = generatorInstance

module.exports.callApi = function (api, params = {}, context = null, extraEventProperties = {}) {
  const event = { params, ...extraEventProperties }
  return new Promise((resolve, reject) => api.handle(event, context, (error, result) => {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  }))
}

/**
 * Assert multiple validation test cases
 *
 * @param {[]} testCases
 */
module.exports.validate = function (testCases) {
  testCases.forEach((testCase) => {
    const throws = testCase.error ? 'throw' : 'not throw'
    it(`should ${throws} error on ${format(testCase.value)} ${testCase.param}`, async () => {
      const data = {}
      data[testCase.param] = testCase.value

      // retrieve the model now that we are inside of `it()`
      testCase.model = testCase.model()
      testCase.model = await testCase.model

      // Validate that data keys are actually model properties
      const attributes = testCase.model.constructor.getAttributes()
      Object.keys(data).forEach(key => {
        assert(key in attributes, `${key} is not a valid attribute on ${testCase.model.constructor.name} object`)
      })

      testCase.model.set(data)
      if (testCase.error) {
        return promiseMe.thatYouReject(testCase.model.validate())
      } else {
        return promiseMe.thatYouResolve(testCase.model.validate())
      }
    })
  })
}

/**
 * Compare a data object to a model
 *
 * @param {{}} data
 * @param {Model} model
 * @param {Array} [except]
 * @return {boolean}
 */
module.exports.assertModelEquals = function (data, model, except) {
  let equality = true
  const modelData = model.get()
  Object.keys(data).forEach(function (key) {
    if (except.indexOf(key) < 0) {
      if (data[key] !== modelData[key]) {
        equality = false
      }
    }
  })

  assert(equality === true)
}

/**
 * Format value for console output
 *
 * @param {*} value
 * @return {*}
 */
const format = function (value) {
  if (value === null) {
    return 'null'
  }

  if (typeof value === 'undefined') {
    return 'undefined'
  }

  if (typeof value === 'string') {
    return `"${value}"`
  }

  return value
}
