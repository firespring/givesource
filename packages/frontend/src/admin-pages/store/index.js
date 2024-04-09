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

export const useAdminStore = defineStore('adminStore', {
  state: () => {
    return {
      cacheKeyValue: 0,
      settingsValues: {},
      updatedValue: 0,
      receipt: null,
      donorEmail: null
    }
  },
  getters: {
    cacheKey: (state) => {
      if (!state.cacheKeyValue) {
        state.cacheKeyValue = new Date().getTime()
      }
      return state.cacheKeyValue
    },
    settings: (state) => {
      return state.settingsValues
    },
    setting: (state) => {
      return (key) => state.settingsValues.hasOwnProperty(key) ? state.settingsValues[key] : null
    },
    updated: (state) => {
      return state.updatedValue
    }
  },
  actions: {
    async setReceipt ({ commit }, payload) {
      commit('setReceipt', payload.html)
      commit('setDonorEmail', payload.email)
    },

    async clearReceipt ({ commit }) {
      commit('setReceipt', null)
      commit('setDonorEmail', null)
    },

    generateCacheKey: function (state) {
      state.cacheKeyValue = new Date().getTime()
    },
    setDonorEmail (state, email) {
      state.donorEmail = email
    }

  }
})
