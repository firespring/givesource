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
import ModalsMixin from './mixins/modals'
import router from './router'
import store from './store'
import VueSocialSharing from 'vue-social-sharing'
import UtilsMixin from './mixins/utils'
import ValidateMixin from './mixins/validate'
import VueGtag from 'vue-gtag'
import { createApp } from 'vue'
import VueFilters from './filters'
import mitt from 'mitt'

import _ from 'lodash'
import $ from 'jquery'

import './assets/css/site.css'
import './assets/css/donation.css'
import './assets/css/default.css'

const emitter = mitt()

// Register window globals
window._ = _
window.$ = window.jQuery = $
window.axios = axios
window.axios.defaults.headers.common['Content-Type'] = 'application/json'

// Bootstrap the app
const app = createApp(App)
  .use(store)
  .use(router)
  // Register filters
  .use(VueFilters)
  // Register plugins
  .use(VueSocialSharing)
  // Register mixins
  .mixin(ModalsMixin)
  .mixin(UtilsMixin)
  .mixin(ValidateMixin)
  // Register directives
  .directive('money', VueMoney.VMoney)
  // Register global components
  .component('ApiError', ApiErrorComponent)
  // Start the app
  // Setup Analytics
  .use(VueGtag, {
    config: { id: store.getters.setting('GOOGLE_ANALYTICS_TRACKING_ID') }
  }, router)
  .provide('bus', emitter)

emitter.$on = emitter.on
emitter.$off = emitter.off
emitter.$emit = emitter.emit
app.config.globalProperties.bus = emitter

app.mount('#app')
