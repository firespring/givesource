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
// const InvalidInputException = require('../exceptions/invalidInput')

const validateUuid = require('uuid-validate')
//
const isUuid = (value) => {
  if (value === '') return
  if (!validateUuid(value)) throw new Error('Must be a uuid')
}

const isNumericType = (value) => {
  // isNumeric: true // allows number like strings
  if (typeof value !== 'number') throw new Error('Must be a number')
}

const isImplicitBool = (value) => {
  const implicitValidValues = ['', null]
  const valid = (typeof value === 'boolean') || implicitValidValues.includes(value)
  if (!valid) throw new Error('Must be a boolean')
}

const isBoolean = (value) => {
  if (value === null) return
  if (typeof value !== 'boolean') throw new Error('Must be a boolean')
}

const isEmail = (value) => {
  // todo just isEmail: true
  const errors = validate.single(value, { presence: false, email: true })
  if (errors) throw new Error('Must be an email address')
}

const isString = (value) => {
  if (value === null) return
  if (typeof value !== 'string') throw new Error('Must be a string')
}

module.exports = { isNumericType, isBoolean, isImplicitBool, isString, isEmail, isUuid }
