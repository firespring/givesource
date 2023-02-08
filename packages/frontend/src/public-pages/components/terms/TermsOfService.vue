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
      <h1 slot="title">
        Terms of Service
      </h1>
    </layout-hero>

    <main class="main">
      <api-error v-model="apiError" />
      <div
        class="wrapper wrapper--sm"
        v-html="terms"
      />
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
        keys: 'TERMS_TEXT'
      })).then(function (response) {
        vue.contents = response.data
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    axios.get(API_URL + 'contents' + Utils.generateQueryString({
      keys: 'TERMS_TEXT'
    })).then(function (response) {
      vue.contents = response.data
      next()
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
      next()
    })
  },
  data: function () {
    return {
      contents: [],
      apiError: {}
    }
  },
  computed: {
    terms: function () {
      const terms = _.find(this.contents, { key: 'TERMS_TEXT' })
      return terms ? terms.value : null
    },
    eventTitle: function () {
      return Settings.eventTitle()
    }
  },
  beforeMount: function () {
    const vue = this

    vue.setBodyClasses('page')
    vue.setPageTitle(vue.eventTitle + ' - Terms of Service')
  }
}
</script>
