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