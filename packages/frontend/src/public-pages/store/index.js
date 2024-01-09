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

import createPersistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {},
    cartItems: [],
    updated: 0,
    pages: []
  },
  mutations: {
    updateCartItemNonprofit: function (state, payload) {
      state.cartItems.forEach(function (item) {
        if (item.nonprofit.id === payload.nonprofit.id) {
          item.nonprofit = payload.nonprofit
        }
      })
    },
    addCartItem: function (state, payload) {
      if (payload.amount && payload.nonprofit !== null) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        let isNew = true
        state.cartItems.forEach(function (item) {
          if (item.nonprofit.id === payload.nonprofit.id) {
            item.amount = item.amount += amount
            item.timestamp = Date.now()
            isNew = false
          }
        })

        if (isNew) {
          state.cartItems.push({
            amount: amount,
            nonprofit: payload.nonprofit,
            timestamp: Date.now()
          })
        }
      }
    },
    removeCartItem: function (state, timestamp) {
      state.cartItems = _.reject(state.cartItems, { timestamp: timestamp })
    },
    updateCartItem: function (state, payload) {
      if (payload.amount && payload.timestamp) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        const cartItem = _.find(state.cartItems, { timestamp: payload.timestamp })
        cartItem.amount = amount
      }
    },
    clearCartItems: function (state) {
      state.cartItems = []
    },
    settings: function (state, settings) {
      Object.keys(settings).forEach(function (key) {
        state.settings[key] = settings[key]
      })
    },
    updated: function (state) {
      state.updated = new Date().getTime()
    },
    pages: function (state, pages) {
      state.pages = pages
    }
  },
  getters: {
    cartItems: function (state) {
      return state.cartItems
    },
    settings: function (state) {
      return state.settings
    },
    setting: function (state) {
      return function (key) {
        return state.settings.hasOwnProperty(key) ? state.settings[key] : null
      }
    },
    booleanSetting: function (state) {
      return function (key, defaultValue) {
        defaultValue = (typeof defaultValue === 'undefined') ? false : defaultValue
        const value = state.settings.hasOwnProperty(key) ? state.settings[key] : defaultValue
        return value === '1' || value === 1 || value === true || (typeof value === 'string' && value.toLowerCase() === 'true')
      }
    },
    updated: function (state) {
      return state.updated
    },
    pages: function (state) {
      return state.pages
    }
  },
  plugins: [
    createPersistedState()
  ]
})
