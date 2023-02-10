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

dotenv.config({ path: `${__dirname}/../../../../.env` })
const nodeEnv = process.env.hasOwnProperty('NODE_ENV') ? process.env.NODE_ENV : 'production'

/**
 * Log a message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.log = function (message, options) {
  if (nodeEnv !== 'test') {
    if (options) {
      console.log(message, options)
    } else {
      console.log(message)
    }
  }
}

/**
 * Log an error message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.error = function (message, options) {
  if (nodeEnv !== 'test') {
    console.error(message, options)
  }
}

/**
 * Log an info message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.info = function (message, options) {
  if (nodeEnv !== 'test') {
    console.info(message, options)
  }
}

/**
 * Log a warning message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.warn = function (message, options) {
  if (nodeEnv !== 'test') {
    console.warn(message, options)
  }
}

/**
 * Log a debug message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.debug = function (message, options) {
  if (nodeEnv !== 'test') {
    console.debug(message, options)
  }
}
