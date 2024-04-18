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
      _cacheKey: 0,
      settings: {},
      updated: 0,
      receipt: null,
      donorEmail: null
    }
  },
  getters: {
    cacheKey: (state) => {
      if (!state._cacheKey) {
        state._cacheKey = new Date().getTime()
      }
      return state._cacheKey
    },
    setting: (state) => {
      return (key) => state.settings.hasOwnProperty(key) ? state.settings[key] : null
    }
  },
  actions: {
    async setReceipt (payload) {
      this.receipt = payload.html
      this.donorEmail = payload.email
    },

    async clearReceipt () {
      this.receipt = null
      this.donorEmail = null
    },

    generateCacheKey: () => {
      this._cacheKey = new Date().getTime()
    },
    setDonorEmail (email) {
      this.donorEmail = email
    }
  }
})
