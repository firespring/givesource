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
    <div class="o-app">
      <navigation :nonprofit-id="nonprofitId" />
      <main
        id="main-content"
        class="o-app__main o-app__main--compact"
      >
        <div class="o-app_main-content o-app_main-content--md">
          <div class="o-app-main-content">
            <api-error v-model="apiError" />

            <div
              v-if="isAdmin"
              class="o-page-header"
            >
              <div class="o-page-header__text">
                <nav class="o-page-header-nav c-breadcrumb">
                  <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                  <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                </nav>
                <h1
                  v-if="nonprofit.legalName"
                  class="o-page-header-title"
                >
                  Manage {{ nonprofit.legalName }}'s Admin Users
                </h1>
              </div>
            </div>

            <div
              v-else
              class="o-page-header"
            >
              <div class="o-page-header__text">
                <nav class="o-page-header-nav c-breadcrumb">
                  <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                </nav>
                <h1 class="o-page-header-title">
                  Manage Admins
                </h1>
              </div>
            </div>

            <div class="c-header-actions">
              <div v-if="canInviteUsers">
                <router-link
                  :to="{ name: 'nonprofit-settings-admins-invite' }"
                  role="button"
                  class="c-btn c-btn--sm c-btn--icon"
                >
                  <i
                    class="fa fa-plus-circle"
                    aria-hidden="true"
                  />Invite Admins
                </router-link>
              </div>
            </div>

            <manage-admins-list-table
              :nonprofit-id="nonprofitId"
              @has-error="hasError"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import ComponentManageAdminsListTable from './ManageAdminsListTable.vue'

export default {
  components: {
    'manage-admins-list-table': ComponentManageAdminsListTable
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
        vue.nonprofit = response.data
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
      vue.nonprofit = response.data
      next()
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
      next()
    })
  },
  props: {
    nonprofitId: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      nonprofit: {},
      apiError: {}
    }
  },
  computed: {
    isAdmin: function () {
      return this.isSuperAdminUser() || this.isAdminUser()
    },
    canInviteUsers: function () {
      return this.nonprofit.status === 'ACTIVE'
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
