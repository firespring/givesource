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
          Thanks for your donation!
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <api-error v-model="apiError" />
      <div
        class="wrapper wrapper--sm"
        v-html="text"
      />

      <div style="margin-top: 1.5rem;">
        <div class="donation-share">
          <ShareNetwork
            :url="pageUrl"
            :title="settings.SOCIAL_SHARING_DESCRIPTION"
            network="facebook"
          >
            <span class="btn btn--xs btn--dark btn--icon btn--facebook"><i
              class="fab fa-facebook-f"
              aria-hidden="true"
            />Share</span>
          </ShareNetwork>
          <ShareNetwork
            :url="pageUrl"
            :title="settings.SOCIAL_SHARING_DESCRIPTION"
            network="twitter"
          >
            <span class="btn btn--xs btn--dark btn--icon btn--twitter"><i
              class="fab fa-twitter"
              aria-hidden="true"
            />Tweet</span>
          </ShareNetwork>
        </div>
      </div>
    </main>

    <layout-footer>
      <layout-sponsors />
    </layout-footer>
  </div>
</template>

<script>
import * as Settings from './../../../helpers/settings'
import * as Utils from './../../../helpers/utils'
import ComponentFooter from './../../layout/Footer.vue'
import ComponentHeader from './../../layout/Header.vue'
import ComponentHero from './../../layout/Hero.vue'
import ComponentSponsors from './../../layout/Sponsors.vue'

export default {
  components: {
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-sponsors': ComponentSponsors
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      return Promise.all([vm.loadContents(), vm.loadSettings()]).catch(err => {
        vm.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate (to, from, next) {
    const vm = this

    Promise.all([vm.loadContents(), vm.loadSettings()]).catch(err => {
      vm.apiError = err.response.data.errors
    }).then(() => {
      next()
    })
  },
  data () {
    return {
      contents: [],

      settings: {
        SOCIAL_SHARING_DESCRIPTION: ''
      },

      apiError: {}
    }
  },
  computed: {
    text () {
      const text = _.find(this.contents, { key: 'CART_RESPONSE_TEXT' })
      return text ? text.value : null
    },
    eventTitle () {
      return Settings.eventTitle()
    },
    pageUrl () {
      return document.location.origin
    }
  },
  beforeMount () {
    const vm = this

    vm.setBodyClasses('page')
    vm.setPageTitle(vm.eventTitle + ' - Thank You')
  },
  methods: {
    loadContents () {
      const vm = this

      return axios.get(API_URL + 'contents' + Utils.generateQueryString({
        keys: 'CART_RESPONSE_TEXT'
      })).then(response => {
        vm.contents = response.data
      })
    },
    loadSettings () {
      const vm = this

      return axios.get(API_URL + 'settings' + Utils.generateQueryString({
        keys: Object.keys(vm.settings)
      })).then(response => {
        response.data.forEach(setting => {
          if (vm.settings.hasOwnProperty(setting.key)) {
            vm.settings[setting.key] = setting.value
          }
        })
      })
    }
  }
}
</script>
