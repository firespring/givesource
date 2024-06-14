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
          {{ eventTitle }} Toolkits
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <api-error v-model="apiError" />
      <div class="wrapper wrapper--sm">
        <div
          style="margin: 0 0 1.5rem;"
          v-html="leadingText"
        />

        <ul class="toolkit">
          <li
            v-for="resource in resources"
            :key="resource.uuid"
            :class="{'toolkit__file': getResourceType(resource) === 'FILE', 'toolkit__link': getResourceType(resource) === 'LINK'}"
          >
            <i
              class="fas fa-fw"
              :class="{'fa-download': getResourceType(resource) === 'FILE', 'fa-link': getResourceType(resource) === 'LINK'}"
            />

            <strong>
              <a
                :href="getResourceLink(resource)"
                target="_blank"
                rel="noopener noreferrer"
              >{{ getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_TITLE') }}</a>
            </strong>
            <br v-if="getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION', false)">
            {{ getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION') }}
          </li>
        </ul>

        <div
          style="margin: 0 0 1.5rem;"
          v-html="additionalText"
        />
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
        keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_LEADING_TEXT', 'TOOLKIT_ADDITIONAL_TEXT']
      })).then(function (response) {
        response.data.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        vue.contents = response.data
      }).then(function () {
        let promise = Promise.resolve()
        vue.contents.forEach(function (content) {
          if (content.type === 'COLLECTION') {
            const fileIndex = _.findIndex(content.value, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE' })
            if (content.value[fileIndex].value) {
              promise = promise.then(function () {
                return axios.get(API_URL + 'files/' + content.value[fileIndex].value).then(function (response) {
                  content.value[fileIndex].value = response.data
                })
              })
            }
          }
        })
        return promise
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    axios.get(API_URL + 'contents' + Utils.generateQueryString({
      keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_LEADING_TEXT', 'TOOLKIT_ADDITIONAL_TEXT']
    })).then(function (response) {
      response.data.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      vue.contents = response.data
    }).then(function () {
      let promise = Promise.resolve()
      vue.contents.forEach(function (content) {
        if (content.type === 'COLLECTION') {
          const fileIndex = _.findIndex(content.value, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE' })
          if (content.value[fileIndex].value) {
            promise = promise.then(function () {
              return axios.get(API_URL + 'files/' + content.value[fileIndex].value).then(function (response) {
                content.value[fileIndex].value = response.data
              })
            })
          }
        }
      })
      return promise
    }).then(function () {
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
    resources: function () {
      return _.filter(this.contents, { key: 'TOOLKIT_RESOURCE_LIST' })
    },
    leadingText: function () {
      const text = _.find(this.contents, { key: 'TOOLKIT_LEADING_TEXT' })
      return text ? text.value : null
    },
    additionalText: function () {
      const text = _.find(this.contents, { key: 'TOOLKIT_ADDITIONAL_TEXT' })
      return text ? text.value : null
    },
    eventTitle: function () {
      return Settings.eventTitle()
    }
  },
  beforeMount: function () {
    const vue = this

    vue.setBodyClasses('page')
    vue.setPageTitle(vue.eventTitle + ' - Toolkits')
  },
  methods: {
    getResourceValue: function (resource, contentKey, defaultValue) {
      const content = _.find(resource.value, { key: contentKey })
      return content ? content.value : defaultValue || null
    },
    getResourceType: function (resource) {
      const vue = this

      return vue.getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_TYPE', 'FILE')
    },
    getResourceLink: function (resource) {
      const vue = this

      if (vue.getResourceType(resource) === 'FILE') {
        return vue.$store.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_FILE').path
      } else {
        return vue.getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_LINK')
      }
    }
  }
}
</script>
