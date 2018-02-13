/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as VueMoney from 'v-money';
import AlertCloseDirective from './directives/alertClose';
import App from './components/App.vue';
import AutoFocusDirective from './directives/autoFocus';
import axios from 'axios';
import EventBusMixin from './mixins/eventBus';
import FloatingLabelDirective from './directives/floatingLabel';
import GravatarComponent from 'vue-gravatar';
import ModalMixin from './mixins/modals';
import NavigationComponent from './components/header/Navigation.vue';
import Request from './helpers/request';
import router from './router';
import ShaveDirective from './directives/shave';
import store from './store';
import UserMixin from './mixins/user';
import UtilsMixin from './mixins/utils';
import ValidateMixin from './mixins/validate';
import Vue from 'vue';
import VueCkeditor from 'vueckeditor';
import VueFilters from './filters';

// Register filters
Vue.use(VueFilters);

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
Vue.component('navigation', NavigationComponent);
Vue.component('v-gravatar', GravatarComponent);
Vue.component('vue-ckeditor', VueCkeditor);

// Register vue global
Vue.prototype.user = {};
Vue.prototype.user.groups = [];

// Register window globals
window._ = require('lodash');
window.axios = axios;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Bootstrap the app
const main = App;
main.router = router;
main.store = store;

// Bootstrap the request library
Vue.prototype.$request = new Request();

// Start the app
const app = new Vue(main);
app.$mount('#app');