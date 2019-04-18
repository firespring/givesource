/*
 * Copyright 2018 Firespring, Inc.
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

import * as VueMoney from 'v-money';
import AlertCloseDirective from './directives/alertClose';
import AutoFocusDirective from './directives/autoFocus';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ComponentApiError from './components/errors/ApiError.vue';
import ComponentApp from './components/App.vue';
import ComponentGravatar from 'vue-gravatar';
import ComponentNavigation from './components/header/Navigation.vue';
import EventBusMixin from './mixins/eventBus';
import FloatingLabelDirective from './directives/floatingLabel';
import ModalMixin from './mixins/modals';
import Request from './helpers/request';
import router from './router';
import ShaveDirective from './directives/shave';
import store from './store';
import UserMixin from './mixins/user';
import UtilsMixin from './mixins/utils';
import ValidateMixin from './mixins/validate';
import Vue from 'vue';
import VueFilters from './filters';

// Register plugins
Vue.use(VueFilters);
Vue.use(CKEditor);

// Register mixins
Vue.mixin(EventBusMixin);
Vue.mixin(ModalMixin);
Vue.mixin(UserMixin);
Vue.mixin(UtilsMixin);
Vue.mixin(ValidateMixin);

// Register directives
Vue.directive('alert-close', AlertCloseDirective);
Vue.directive('auto-focus', AutoFocusDirective);
Vue.directive('floating-label', FloatingLabelDirective);
Vue.directive('money', VueMoney.VMoney);
Vue.directive('shave', ShaveDirective);

// Register global components
Vue.component('api-error', ComponentApiError);
Vue.component('navigation', ComponentNavigation);
Vue.component('v-gravatar', ComponentGravatar);

// Bootstrap libs
// bootstrapCkeditor();

// Register vue global
Vue.prototype.user = {};
Vue.prototype.user.groups = [];

// Register window globals
window._ = require('lodash');
window.axios = axios;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Bootstrap the app
const main = ComponentApp;
main.router = router;
main.store = store;

// Bootstrap the request library
Vue.prototype.$request = new Request();

// Start the app
const app = new Vue(main);
app.$mount('#app');