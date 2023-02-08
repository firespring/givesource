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
        Nonprofit Search Results
      </h1>
    </layout-hero>

    <main class="main">
      <div class="wrapper wrapper--sm">
        <search-results-header
          :category="category"
          :search="search"
        />

        <p
          v-if="search && pagination.loaded"
          class="mt3 mb3 text-c"
        >
          <strong>Your search for "{{ search }}" returned {{ pagination.items.length }} {{ pagination.items.length | pluralize('result') }}.</strong>
        </p>

        <div
          v-if="pagination.loaded && pagination.items.length"
          class="leaderboard"
        >
          <search-results-row
            v-for="nonprofit in pagination.items"
            :key="nonprofit.id"
            :nonprofit="nonprofit"
          />
        </div>

        <div
          v-else-if="pagination.loaded && pagination.items.length === 0"
          class="leaderboard"
        >
          <div
            v-if="!search"
            class="leaderboard-item"
          >
            <div
              v-if="!category && !search"
              class="leaderboard-item__info text-c"
            >
              There are no nonprofits.
            </div>
            <div
              v-else-if="category && !search"
              class="leaderboard-item__info text-c"
            >
              There are no nonprofits in that category.
            </div>
          </div>
        </div>

        <div
          v-else
          class="leaderboard"
        >
          <div class="ma5 text-c">
            <layout-spinner />
          </div>
        </div>

        <pagination
          v-if="pagination.loaded"
          :pagination="pagination"
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
import ComponentPagination from './../pagination/Pagination.vue'
import ComponentSearchResultsHeader from './SearchResultsHeader.vue'
import ComponentSearchResultsRow from './SearchResultsRow.vue'
import ComponentSpinner from './../layout/Spinner.vue'
import ComponentSponsors from './../layout/Sponsors.vue'
import PaginationMixin from './../../mixins/pagination'

export default {
  components: {
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-spinner': ComponentSpinner,
    'layout-sponsors': ComponentSponsors,
    pagination: ComponentPagination,
    'search-results-header': ComponentSearchResultsHeader,
    'search-results-row': ComponentSearchResultsRow
  },
  mixins: [
    PaginationMixin
  ],
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      let options = {}
      if (to.query.hasOwnProperty('search')) {
        vue.search = to.query.search
        options.legalName = vue.search.toLowerCase()
      }
      if (to.query.hasOwnProperty('category')) {
        vue.category = to.query.category
        options.category = vue.category
      }
      if (Object.keys(options).length) {
        options.status = 'ACTIVE'
        options.includeMatchFund = 0
        axios.get(API_URL + 'nonprofits/search' + Utils.generateQueryString(options)).then(function (response) {
          if (!options.hasOwnProperty('legalName')) {
            response.data.sort(function (a, b) {
              return Utils.sortAlphabetically(a, b, 'legalName')
            })
          }
          vue.fetchLogos(response.data).then(function () {
            vue.setPaginationData({ items: response.data })
          })
        })
      } else {
        options = _.extend({ includeMatchFund: 0 }, { size: '10', sort: 'active_legal_name_ascending' }, to.query)
        axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
          vue.fetchLogos(response.data.items).then(function () {
            vue.setPaginationData(response.data)
          })
        })
      }
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    // Reset form and pagination
    vue.category = 0
    vue.search = ''
    vue.resetPaginationData()

    let options = {}
    if (to.query.hasOwnProperty('search')) {
      vue.search = to.query.search
      options.legalName = vue.search.toLowerCase()
    }
    if (to.query.hasOwnProperty('category')) {
      vue.category = to.query.category
      options.category = vue.category
    }
    if (Object.keys(options).length) {
      options.status = 'ACTIVE'
      options.includeMatchFund = 0
      axios.get(API_URL + 'nonprofits/search' + Utils.generateQueryString(options)).then(function (response) {
        if (!options.hasOwnProperty('legalName')) {
          response.data.sort(function (a, b) {
            return Utils.sortAlphabetically(a, b, 'legalName')
          })
        }
        vue.fetchLogos(response.data).then(function () {
          vue.setPaginationData({ items: response.data })
          next()
        })
      })
    } else {
      options = _.extend({ includeMatchFund: 0 }, { size: '10', sort: 'active_legal_name_ascending' }, to.query)
      axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
        vue.fetchLogos(response.data.items).then(function () {
          vue.setPaginationData(response.data)
          next()
        })
      })
    }
  },
  data: function () {
    return {
      category: 0,
      search: ''
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
    vue.setPageTitle(vue.eventTitle + ' - Search')
  },
  methods: {
    fetchLogos: function (nonprofits) {
      let promise = Promise.resolve()
      if (nonprofits) {
        const logoIds = _.filter(_.map(nonprofits, 'logoFileId'))
        if (logoIds.length) {
          promise = axios.get(API_URL + 'files' + Utils.generateQueryString({ fileIds: logoIds })).then(function (response) {
            _.forEach(nonprofits, function (nonprofit) {
              nonprofit.logo = _.find(response.data, { id: nonprofit.logoFileId })
            })
          })
        }
      }
      return promise
    }
  }
}
</script>
