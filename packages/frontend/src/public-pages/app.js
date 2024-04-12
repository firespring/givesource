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
import VueSocialSharing from 'vue-social-sharing'
import UtilsMixin from './mixins/utils'
import ValidateMixin from './mixins/validate'
import VueGtag from 'vue-gtag'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAppStore } from './store'
import VueFilters from './filters'
import mitt from 'mitt'

import './assets/css/site.css'
import './assets/css/donation.css'
import './assets/css/default.css'

const emitter = mitt()
const pinia = createPinia()

// Register window globals
window._ = require('lodash')
window.$ = window.jQuery = require('jquery')
window.axios = axios
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Bootstrap the app
const app = createApp(App)
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
  .provide('bus', emitter)

emitter.$on = emitter.on
emitter.$off = emitter.off
emitter.$emit = emitter.emit
app.config.globalProperties.bus = emitter

app.use(pinia)

// Setup Analytics
const store = useAppStore()
app.use(VueGtag, {
  config: { id: store.setting('GOOGLE_ANALYTICS_TRACKING_ID') }
}, router)

app.mount('#app')
