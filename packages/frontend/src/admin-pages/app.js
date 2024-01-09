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
import AlertCloseDirective from './directives/alertClose'
import AutoFocusDirective from './directives/autoFocus'
import axios from 'axios'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ComponentApiError from './components/errors/ApiError.vue'
import ComponentApp from './components/App.vue'
import VueGravatar from 'vue3-gravatar'
import ComponentNavigation from './components/header/Navigation.vue'
import ComponentPaymentspringKeysBanner from './components/banner/PaymentSpringKeysBanner.vue'
import FloatingLabelDirective from './directives/floatingLabel'
import ModalMixin from './mixins/modals'
import Request from './helpers/request'
import router from './router'
import ShaveDirective from './directives/shave'
import store from './store'
import UserMixin from './mixins/user'
import UtilsMixin from './mixins/utils'
import ValidateMixin from './mixins/validate'
import { createApp } from 'vue'
import VueFilters from './filters'
import mitt from 'mitt'

const emitter = mitt()

// Register window globals
window._ = require('lodash')
window.axios = axios
axios.defaults.headers.common['Content-Type'] = 'application/json'

const app = createApp(ComponentApp)
  .use(store)
  // Register plugins
  .use(VueFilters)
  .use(CKEditor)
  .use(VueGravatar)
  // Register mixins
  .mixin(ModalMixin)
  .mixin(UserMixin)
  .mixin(UtilsMixin)
  .mixin(ValidateMixin)
  // Register directives
  .directive('alert-close', AlertCloseDirective)
  .directive('auto-focus', AutoFocusDirective)
  .directive('floating-label', FloatingLabelDirective)
  .directive('money', VueMoney.VMoney)
  .directive('shave', ShaveDirective)
  // Register global components
  .component('ApiError', ComponentApiError)
  .component('Navigation', ComponentNavigation)
  .component('PaymentspringKeysBanner', ComponentPaymentspringKeysBanner)
  // Event Bus
  .provide('bus', emitter)
  .provide('$axios', axios)

emitter.$on = emitter.on
emitter.$off = emitter.off
emitter.$emit = emitter.emit

app.config.globalProperties.bus = emitter
router.app = app
app.use(router)

app.config.globalProperties.$request = new Request()

app.config.globalProperties.user = {}
app.config.globalProperties.groups = []

// Start the app
app.mount('#app')
