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

const VueFilters = {
  install: function (Vue) {
    Vue.filter('fromCents', fromCents)
    Vue.filter('fromPercent', fromPercent)
    Vue.filter('money', money)
    Vue.filter('percent', percent)
    Vue.filter('toCents', toCents)
    Vue.filter('toPercent', toPercent)
    Vue.filter('zeroToEmptyString', zeroToEmptyString)
  }
}

export default VueFilters
