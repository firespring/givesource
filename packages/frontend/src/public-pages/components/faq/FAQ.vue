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
  <div>
    <layout-header />

    <layout-hero :presented-by="true">
      <template #title>
        <h1>
          Frequently Asked Questions
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <api-error v-model="apiError" />
      <div class="wrapper wrapper--sm">
        <ol>
          <li
            v-for="(content, index) in contents"
            :key="content.uuid + '-link'"
          >
            <a :href="'#faq' + (index + 1)">{{ getContentValue(content, 'FAQ_LIST_ITEM_QUESTION') }}</a>
          </li>
        </ol>

        <hr>

        <div
          v-for="(content, index) in contents"
          :key="content.uuid"
        >
          <h2 :id="'faq' + (index + 1)">
            {{ getContentValue(content, 'FAQ_LIST_ITEM_QUESTION') }}
          </h2>
          <div
            style="margin: 0 0 1.5rem;"
            v-html="getContentValue(content, 'FAQ_LIST_ITEM_ANSWER')"
          />
        </div>
      </div>
    </main>

    <layout-footer>
      <layout-sponsors />
    </layout-footer>
  </div>
</template>

<script>
import * as Settings from './../../helpers/settings'
import * as Utils from './../../helpers/utils'
import ComponentFooter from './../layout/Footer.vue'
import ComponentHeader from './../layout/Header.vue'
import ComponentHero from './../layout/Hero.vue'
import ComponentSponsors from './../layout/Sponsors.vue'

export default {
  components: {
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-sponsors': ComponentSponsors
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      axios.get(API_URL + 'contents' + Utils.generateQueryString({
        keys: 'FAQ_LIST'
      })).then(function (response) {
        response.data.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        vue.contents = response.data
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    axios.get(API_URL + 'contents' + Utils.generateQueryString({
      keys: 'FAQ_LIST'
    })).then(function (response) {
      response.data.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      vue.contents = response.data
      next()
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
    })
  },
  data: function () {
    return {
      contents: [],
      apiError: {}
    }
  },
  computed: {
    eventTitle: function () {
      return Settings.eventTitle()
    }
  },
  beforeMount: function () {
    const vue = this

    vue.setBodyClasses('page')
    vue.setPageTitle(vue.eventTitle + ' - Frequently Asked Questions')
  },
  methods: {
    getContentValue: function (content, contentKey) {
      const item = _.find(content.value, { key: contentKey })
      return item ? item.value : null
    }
  }
}
</script>
