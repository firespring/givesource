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
      settingsValues: {},
      cartItemsList: [],
      updatedValue: 0,
      pagesList: []
    }
  },
  getters: {
    cartItems: (state) => {
      return state.cartItemsList
    },
    settings: (state) => {
      return state.settingsValues
    },
    setting: (state) => {
      return (key) => state.settingsValues.hasOwnProperty(key) ? state.settingsValues[key] : null
    },
    booleanSetting: (state) => {
      return (key, defaultValue) => {
        defaultValue = (typeof defaultValue === 'undefined') ? false : defaultValue
        const value = state.settingsValues.hasOwnProperty(key) ? state.settingsValues[key] : defaultValue
        return value === '1' || value === 1 || value === true || (typeof value === 'string' && value.toLowerCase() === 'true')
      }
    },
    updated: (state)  => {
      return state.updatedValue
    },
    pages: (state) => {
      return state.pagesList
    }
  },
  actions: {
    updateCartItemNonprofit: (state, payload) => {
      state.cartItemsList.forEach(function (item) {
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
        state.cartItemsList.forEach(function (item) {
          if (item.nonprofit.id === payload.nonprofit.id) {
            item.amount = item.amount += amount
            item.timestamp = Date.now()
            isNew = false
          }
        })

        if (isNew) {
          state.cartItemsList.push({
            amount: amount,
            nonprofit: payload.nonprofit,
            timestamp: Date.now()
          })
        }
      }
    },
    removeCartItem: (state, timestamp) => {
      state.cartItemsList = _.reject(state.cartItemsList, { timestamp: timestamp })
    },
    updateCartItem: (state, payload) => {
      if (payload.amount && payload.timestamp) {
        let amount = payload.amount
        if (typeof amount === 'string' && amount.indexOf('.') > -1) {
          amount = Math.round(parseFloat(payload.amount) * 100)
        }

        const cartItem = _.find(state.cartItemsList, { timestamp: payload.timestamp })
        cartItem.amount = amount
      }
    },
    clearCartItems: (state) => {
      state.cartItemsList = []
    },
    updateSettings: (state, settings) => {
      state.settingsValues = settings
    },
    setPages: (state, pages) => {
      state.pagesList = pages
    }
  }
})
