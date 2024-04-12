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

import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => {
    return {
      _settings: {},
      _cartItems: [],
      _updated: 0,
      _pages: []
    }
  },
  getters: {
    cartItems: (state) => {
      return state._cartItems
    },
    settings: (state) => {
      return state._settings
    },
    setting: (state) => {
      return (key) => state._settings.hasOwnProperty(key) ? state._settings[key] : null
    },
    booleanSetting: (state) => {
      return (key, defaultValue) => {
        defaultValue = (typeof defaultValue === 'undefined') ? false : defaultValue
        const value = state._settings.hasOwnProperty(key) ? state._settings[key] : defaultValue
        return value === '1' || value === 1 || value === true || (typeof value === 'string' && value.toLowerCase() === 'true')
      }
    },
    pages: (state) => {
      return state._pages
    }
  },
  actions: {
    updateCartItemNonprofit: (state, payload) => {
      state._cartItems.forEach(function (item) {
        if (item.nonprofit.id === payload.nonprofit.id) {
          item.nonprofit = payload.nonprofit
        }
      })
    },
    addCartItem: (state, payload) => {
      if (payload.amount && payload.nonprofit !== null) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        let isNew = true
        state._cartItems.forEach(function (item) {
          if (item.nonprofit.id === payload.nonprofit.id) {
            item.amount = item.amount += amount
            item.timestamp = Date.now()
            isNew = false
          }
        })

        if (isNew) {
          state._cartItems.push({
            amount: amount,
            nonprofit: payload.nonprofit,
            timestamp: Date.now()
          })
        }
      }
    },
    removeCartItem: (state, timestamp) => {
      state._cartItems = _.reject(state._cartItems, { timestamp: timestamp })
    },
    updateCartItem: (state, payload) => {
      if (payload.amount && payload.timestamp) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        const cartItem = _.find(state._cartItems, { timestamp: payload.timestamp })
        cartItem.amount = amount
      }
    },
    clearCartItems: (state) => {
      state._cartItems = []
    },
    updateSettings: (state, settings) => {
      state._settings = settings
    },
    setPages: (state, pages) => {
      state._pages = pages
    },
    updated: (state) => {
      state._updated = new Date().getTime()
    }
  }
})
