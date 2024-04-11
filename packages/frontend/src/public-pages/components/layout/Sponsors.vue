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
  <div
    v-if="displaySponsorTiers"
    class="sponsors wrapper"
  >
    <h2 class="sponsors-title">
      Many Thanks To Our Sponsors
    </h2>

    <div
      v-for="sponsorTier in sponsorTiers"
      :key="sponsorTier.id"
      class="sponsors__tier"
      :class="getSponsorTierClass(sponsorTier.size)"
    >
      <div class="sponsors__tier-title">
        <h3>{{ sponsorTier.name }}</h3>
      </div>

      <div class="sponsors__tier-list">
        <div
          v-for="sponsor in sponsors[sponsorTier.id]"
          :key="sponsor.id"
          class="sponsor"
          :class="{ 'sponsor--no-logo': !sponsor.fileId }"
        >
          <a
            v-if="sponsor.url"
            :href="sponsor.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              v-if="sponsor.fileId"
              width="320"
              :alt="sponsor.name"
              :src="getSponsorImage(sponsor.fileId)"
            >
            <span
              v-else
              class="logo-text"
            >{{ sponsor.name }}</span>
          </a>
          <img
            v-else-if="sponsor.fileId"
            width="320"
            :alt="sponsor.name"
            :src="getSponsorImage(sponsor.fileId)"
          >
          <span
            v-else
            class="logo-text"
          >{{ sponsor.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Utils from './../../helpers/utils'
import { useAppStore } from "../../store"

export default {
  data: function () {
    return {
      files: {},
      loaded: false,
      sponsors: {},
      sponsorTiers: []
    }
  },
  computed: {
    displaySponsorTiers: function () {
      return this.loaded && Object.keys(this.sponsors).length
    }
  },
  beforeCreate () {
    this.$store = useAppStore()
  },
  created: function () {
    const vue = this

    axios.get(API_URL + 'sponsor-tiers/').then(function (response) {
      response.data.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      vue.sponsorTiers = response.data
    }).then(function () {
      let promise = Promise.resolve()
      vue.sponsorTiers.forEach(function (sponsorTier) {
        promise = promise.then(function () {
          return axios.get(API_URL + 'sponsor-tiers/' + sponsorTier.id + '/sponsors').then(function (response) {
            response.data.sort(function (a, b) {
              return a.sortOrder - b.sortOrder
            })
            vue.sponsors[sponsorTier.id] = response.data
            response.data.forEach(function (sponsor) {
              if (sponsor.fileId) {
                vue.files[sponsor.fileId] = {}
              }
            })
          })
        })
      })
      return promise
    }).then(function () {
      const fileIds = Object.keys(vue.files)
      if (fileIds.length) {
        return axios.get(API_URL + 'files' + Utils.generateQueryString({ fileIds: fileIds }))
      } else {
        return Promise.resolve()
      }
    }).then(function (response) {
      if (response && response.data) {
        response.data.forEach(function (file) {
          vue.files[file.id] = file
        })
      }
    }).then(function () {
      vue.loaded = true
    })
  },
  methods: {
    getSponsorTierClass: function (size) {
      switch (size) {
        case 'LARGE':
          return 'sponsors__tier--lg'
        case 'SMALL':
          return 'sponsors__tier--sm'
        default:
          return 'sponsors__tier--md'
      }
    },
    getSponsorImage: function (fileId) {
      const vue = this

      const file = vue.files[fileId]
      return file.hasOwnProperty('path') ? vue.$store.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + file.path : false
    }
  }
}
</script>
