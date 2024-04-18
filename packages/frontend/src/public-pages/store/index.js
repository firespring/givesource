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
      settings: {},
      cartItems: [],
      updated: 0,
      pages: []
    }
  },
  getters: {
    setting: (state) => {
      return (key) => state.settings.hasOwnProperty(key) ? state.settings[key] : null
    },
    booleanSetting: (state) => {
      return (key, defaultValue) => {
        defaultValue = (typeof defaultValue === 'undefined') ? false : defaultValue
        const value = state.settings.hasOwnProperty(key) ? state.settings[key] : defaultValue
        return value === '1' || value === 1 || value === true || (typeof value === 'string' && value.toLowerCase() === 'true')
      }
    }
  },
  actions: {
    updateCartItemNonprofit: (payload) => {
      this.cartItems.forEach(function (item) {
        if (item.nonprofit.id === payload.nonprofit.id) {
          item.nonprofit = payload.nonprofit
        }
      })
    },
    addCartItem: (payload) => {
      if (payload.amount && payload.nonprofit !== null) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        let isNew = true
        this.cartItems.forEach(function (item) {
          if (item.nonprofit.id === payload.nonprofit.id) {
            item.amount = item.amount += amount
            item.timestamp = Date.now()
            isNew = false
          }
        })

        if (isNew) {
          this.cartItems.push({
            amount: amount,
            nonprofit: payload.nonprofit,
            timestamp: Date.now()
          })
        }
      }
    },
    removeCartItem: (timestamp) => {
      this.cartItems = _.reject(this.cartItems, { timestamp: timestamp })
    },
    updateCartItem: (payload) => {
      if (payload.amount && payload.timestamp) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        const cartItem = _.find(this.cartItems, { timestamp: payload.timestamp })
        cartItem.amount = amount
      }
    },
    clearCartItems: () => {
      this.cartItems = []
    },
    updateSettings: (settings) => {
      this.settings = settings
    }
  }
})
