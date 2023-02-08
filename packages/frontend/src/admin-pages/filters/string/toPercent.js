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

const numeral = require('numeral')

/**
 * Convert the provided whole number percent into a decimal.
 * For example 2.9 would be converted to 0.029.
 *
 * @param {*} value
 * @returns {*}
 */
function toPercent (value) {
  return numeral(value / 100).format('0.0[000000]')
}

export default toPercent
