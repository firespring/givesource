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

const validate = require('validate.js')
const validateUuid = require('uuid-validate')
const InvalidInputException = require('../exceptions/invalidInput')

exports.loadCustom = function () {
  validate.validators.type = function (value, options, key, attributes) {
    let isValid = false
    const types = (typeof options === 'string' && options.length > 0) ? options.split('|') : []

    if (!value || value === false || typeof value === 'undefined' || value === null) {
      return null
    }

    for (const i in types) {
      const type = types[i].toLowerCase()
      switch (type) {
        case 'array':
          if (value instanceof Array) {
            isValid = true
          }
          break

        case 'boolean':
        case 'function':
        case 'number':
        case 'object':
        case 'string':
        case 'symbol':
        case 'undefined':
        default:
          if (typeof value === type) { // eslint-disable-line valid-typeof
            isValid = true
          }
          break
      }
    }

    if (!isValid) {
      const message = types.join(', ')
      throw new InvalidInputException(`${key} is not one of the expected types: ${message}`)
    }

    return null
  }

  validate.validators.uuid = function (value, options, key, attributes) {
    let isValid = false

    if (!value || value === false || typeof value === 'undefined' || value === null) {
      return null
    }

    if (options && typeof options === 'number') {
      isValid = validateUuid(value, options)
    } else {
      isValid = validateUuid(value)
    }

    if (!isValid) {
      throw new InvalidInputException(`${key} is an invalid uuid`)
    }

    return null
  }
}
