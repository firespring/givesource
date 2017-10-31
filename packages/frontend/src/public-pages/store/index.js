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
		settings: {},
		cartItems: []
	},
	mutations: {
		addCartItem: function (state, payload) {
			if (payload.amount && payload.nonprofit !== null) {
				let amount = payload.amount;
				if (typeof amount === 'string' && amount.indexOf('.') > -1) {
					amount = Math.round(Number.parseFloat(payload.amount) * 100);
				}

				state.cartItems.push({
					amount: amount,
					nonprofit: payload.nonprofit,
					timestamp: Date.now(),
				});
			}
		},
		removeCartItem: function (state, timestamp) {
			_.remove(state.cartItems, {timestamp: timestamp});
		},
		updateCartItem: function (state, payload) {
			if (payload.amount && payload.timestamp) {

				let amount = payload.amount;
				if (typeof amount === 'string' && amount.indexOf('.') > -1) {
					amount = Math.round(Number.parseFloat(payload.amount) * 100);
				}

				const cartItem = _.find(state.cartItems, {timestamp: payload.timestamp});
				cartItem.amount = amount;
			}
		},
		clearCartItems: function (state) {
			state.cartItems = [];
		},
		settings: function (state, settings) {
			Object.keys(settings).forEach(function (key) {
				state.settings[key] = settings[key];
			});
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
		}
	},
	plugins: [
		createPersistedState()
	]
});

export default store;