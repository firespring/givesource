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

import * as VueMoney from 'v-money'
import ApiErrorComponent from './components/errors/ApiError.vue'
import App from './components/App.vue'
import axios from 'axios'
import EventBusMixin from './mixins/eventBus'
import ModalsMixin from './mixins/modals'
import router from './router'
import store from './store'
import SocialSharing from 'vue-social-sharing'
import UtilsMixin from './mixins/utils'
import ValidateMixin from './mixins/validate'
import VueAnalytics from 'vue-analytics'
import Vue from 'vue'
import VueFilters from './filters'

// Register filters
Vue.use(VueFilters)

// Register plugins
Vue.use(SocialSharing)

// Register mixins
Vue.mixin(EventBusMixin)
Vue.mixin(ModalsMixin)
Vue.mixin(UtilsMixin)
Vue.mixin(ValidateMixin)

// Register directives
Vue.directive('money', VueMoney.VMoney)

// Register global components
Vue.component('ApiError', ApiErrorComponent)

// Register window globals
window._ = require('lodash')
window.$ = window.jQuery = require('jquery')
window.axios = axios
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Bootstrap the app
const main = App
main.router = router
main.store = store

// Setup Analytics
Vue.use(VueAnalytics, {
  id () {
    return store.getters.setting('GOOGLE_ANALYTICS_TRACKING_ID')
  },
  router,
  autoTracking: {
    pageviewOnLoad: false
  }
})

// Start the app
const app = new Vue(main)
app.$mount('#app')
