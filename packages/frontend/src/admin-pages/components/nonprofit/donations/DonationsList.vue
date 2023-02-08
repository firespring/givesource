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
  <div class="o-app">
    <navigation :nonprofit-id="nonprofitId" />
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content">
        <div class="o-app-main-content">
          <api-error v-model="apiError" />
          <donations-metrics :nonprofit="nonprofit" />

          <div
            v-if="isAdmin"
            class="o-page-header"
          >
            <div class="o-page-header__text">
              <nav class="o-page-header-nav c-breadcrumb">
                <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
              </nav>
              <h1
                v-if="nonprofit.legalName"
                class="o-page-header-title"
              >
                Donations for {{ nonprofit.legalName }}
              </h1>
            </div>
          </div>

          <donations-list-table-header
            :nonprofit="nonprofit"
            @has-error="hasError"
          />
          <donations-list-table
            :donations="pagination.items"
            :loaded="pagination.loaded"
          />
          <paginated-table-footer
            v-if="pagination.loaded"
            :pagination="pagination"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import * as Utils from './../../../helpers/utils'
import ComponentDonationsListTable from './DonationsListTable.vue'
import ComponentDonationsListTableHeader from './DonationsListTableHeader.vue'
import ComponentDonationsMetrics from './DonationsMetrics.vue'
import ComponentPaginatedTableFooter from './../../pagination/PaginatedTableFooter.vue'
import PaginationMixin from './../../../mixins/pagination'

export default {
  components: {
    'donations-list-table': ComponentDonationsListTable,
    'donations-list-table-header': ComponentDonationsListTableHeader,
    'donations-metrics': ComponentDonationsMetrics,
    'paginated-table-footer': ComponentPaginatedTableFooter
  },
  mixins: [
    PaginationMixin
  ],
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
        vue.nonprofit = response.data
        return vue.$request.get('/nonprofits/' + to.params.nonprofitId + '/donations', to.query)
      }).then(function (response) {
        vue.setPaginationData(response.data)
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.resetPaginationData()
    vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
      vue.nonprofit = response.data
      return vue.$request.get('/nonprofits/' + to.params.nonprofitId + '/donations', to.query)
    }).then(function (response) {
      vue.setPaginationData(response.data)
      next()
    }).catch(function () {
      next()
    })
  },
  props: [
    'nonprofitId'
  ],
  data: function () {
    return {
      nonprofit: {},
      apiError: {}
    }
  },
  computed: {
    isAdmin: function () {
      return this.isSuperAdminUser() || this.isAdminUser()
    }
  },
  methods: {
    hasError: function (err) {
      const vue = this
      vue.apiError = err.response.data.errors
    }
  }
}
</script>
