<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <a
    v-if="page === current"
    class="here"
  >{{ page + 1 }}</a>
  <router-link
    v-else
    :to="generatePageLink({start: start})"
    active-class=""
  >
    {{ page + 1 }}
  </router-link>
</template>

<script>
export default {
  props: {
    current: { type: Number, default: 0 },
    page: { type: Number, default: 0 },
    size: { type: Number, default: 0 }
  },
  computed: {
    start: function () {
      return this.page * this.size
    }
  },
  methods: {
    generatePageLink: function (query) {
      const vue = this
      query = query || {}
      query = _.extend({}, vue.$route.query, query)
      Object.keys(query).forEach(function (key) {
        if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
          delete query[key]
        }
      })
      return {
        name: vue.$route.name,
        query: query
      }
    }
  }
}
</script>
