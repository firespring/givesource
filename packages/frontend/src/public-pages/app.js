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

import * as VueMoney from "v-money";
import App from './components/App.vue';
import axios from "axios";
import EventBusMixin from './mixins/eventBus';
import ModalsMixin from './mixins/modals';
import router from './router';
import store from './store';
import UtilsMixin from './mixins/utils';
import ValidateMixin from './mixins/validate';
import Vue from "vue";

// Register mixins
Vue.mixin(EventBusMixin);
Vue.mixin(ModalsMixin);
Vue.mixin(UtilsMixin);
Vue.mixin(ValidateMixin);

// Register directives
Vue.directive('money', VueMoney.VMoney);

// Register window globals
window._ = require('lodash');
window.$ = window.jQuery = require('jquery');
window.axios = axios;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Bootstrap the app
const main = App;
main.router = router;
main.store = store;

// Start the app
const app = new Vue(main);
app.$mount('#app');