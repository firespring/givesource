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

import createPersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		updated: 0,
		settings: {}
	},
	mutations: {
		settings: function (state, settings) {
			Object.keys(settings).forEach(function (key) {
				state.settings[key] = settings[key];
			});
		},
		updated: function (state) {
			state.updated = new Date().getTime();
		}
	},
	getters: {
		settings: function (state) {
			return state.settings;
		},
		setting: function (state) {
			return function (key) {
				return state.settings.hasOwnProperty(key) ? state.settings[key] : null;
			}
		},
		updated: function (state) {
			return state.updated;
		}
	},
	plugins: [
		createPersistedState()
	]
});

export default store;