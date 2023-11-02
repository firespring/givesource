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

import fromCents from './string/fromCents'
import fromPercent from './string/fromPercent'
import money from './string/money'
import percent from './string/percent'
import toCents from './string/toCents'
import toPercent from './string/toPercent'
import zeroToEmptyString from './string/zeroToEmptyString'

export const $filters = {
  fromCents (value) {
    return fromCents(value)
  },
  toCents (value) {
    return toCents(value)
  },
  fromPercent (value) {
    return fromPercent(value)
  },
  toPercent (value) {
    return toPercent(value)
  },
  money (value) {
    return money(value)
  },
  percent (value) {
    return percent(value)
  },
  zeroToEmptyString (value) {
    return zeroToEmptyString(value)
  }
}

const VueFilters = {
  install: function (app) {
    app.config.globalProperties.$filters = $filters
  }
}

export default VueFilters
