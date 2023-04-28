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

require('jquery.payment')
const validate = require('validate.js')

// Add "label" validator to allow custom label mapping functionality
validate.validators.label = function () {
  return []
}

/**
 * Credit card number validator
 *
 * @param {*} value
 * @param {{}} [options]
 * @return {*}
 */
validate.validators.ccNumber = function (value, options) {
  if (!value || value === false || typeof value === 'undefined' || value === null) {
    return null
  }
  if (!$.payment.validateCardNumber(value)) {
    if (options && options.hasOwnProperty('message')) {
      return options.message
    }
    return 'is not valid'
  }
  return null
}

/**
 * Credit card security code validator
 *
 * @param {*} value
 * @param {{}} [options]
 * @return {*}
 */
validate.validators.ccCvv = function (value, options) {
  if (!value || value === false || typeof value === 'undefined' || value === null) {
    return null
  }
  if (!$.payment.validateCardCVC(value)) {
    if (options && options.hasOwnProperty('message')) {
      return options.message
    }
    return 'is not valid'
  }
  return null
}

/**
 * Validate that an array contains required options
 *
 * @param {*} value
 * @param {{}} [options]
 * @return {*}
 */
validate.validators.arrayIncludes = function (value, options, attribute, allValues) {
  if (typeof value === 'undefined') {
    value = allValues[options.attributeName]
  }
  if (options.required.length === 0) {
    return null
  }
  if (!Array.isArray(value)) {
    return 'is not an array'
  }

  for (let i = 0; i < options.required.length; i++) {
    const requiredValue = options.required[i]
    if (!value.includes(requiredValue)) {
      return options.message || 'is not valid'
    }
  }

  return null
}

const mixin = {
  methods: {
    validate: function (data, constraints) {
      return this.getErrorMessages(validate(data, constraints, { fullMessages: false }), constraints)
    },
    getErrorMessages: function (errors, constraints) {
      const validationErrors = {}
      for (const field in errors) {
        if (errors.hasOwnProperty(field) && errors[field].length > 0) {
          const label = constraints[field].hasOwnProperty('label') ? constraints[field].label : validate.capitalize(validate.prettify(field))
          validationErrors[field] = label + ' ' + errors[field][0]
        }
      }
      return validationErrors
    },
    scrollToError: function () {
      this.$nextTick(function () {
        $('.has-error:first').closest('.form-item').first('.form-item__label')[0].scrollIntoView(true)
      })
    }
  }
}

export default mixin
