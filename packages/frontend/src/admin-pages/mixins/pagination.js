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

export default {
  data: function () {
    return {
      pagination: {
        items: [],
        loaded: false,
        size: 0,
        sort: '',
        start: 0,
        total: 0
      }
    }
  },
  methods: {
    resetPaginationData: function () {
      const vue = this

      vue.pagination = {
        items: [],
        loaded: false,
        size: 0,
        sort: '',
        start: 0,
        total: 0
      }
    },
    setPaginationData: function (data) {
      const vue = this

      Object.keys(vue.pagination).forEach(function (key) {
        if (data.hasOwnProperty(key)) {
          vue.pagination[key] = data[key]
        }
      })
      vue.pagination.loaded = true
    }
  }
}
