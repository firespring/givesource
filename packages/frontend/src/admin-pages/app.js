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
import ComponentGravatar from 'vue-gravatar'
import ComponentNavigation from './components/header/Navigation.vue'
import ComponentPaymentspringKeysBanner from './components/banner/PaymentSpringKeysBanner.vue'
import EventBusMixin from './mixins/eventBus'
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

// Register window globals
window._ = require('lodash')
window.axios = axios
axios.defaults.headers.common['Content-Type'] = 'application/json'


const app = createApp(ComponentApp)
  .use(router)
  .use(store)
  // Register plugins
  .use(VueFilters)
  .use(CKEditor)
  // Register mixins
  .mixin(EventBusMixin)
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
  .component('VGravatar', ComponentGravatar)
  .component('PaymentspringKeysBanner', ComponentPaymentspringKeysBanner)
  // Start the app
  .mount('#app')

app.provide('$axios', axios)

// Register vue global
app.prototype.user = {}
app.prototype.user.groups = []
// Bootstrap the request library
app.prototype.$request = new Request()
