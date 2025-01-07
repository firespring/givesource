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
    <main
      id="main-content"
      class="o-app__main o-app__main--compact"
    >
      <div class="o-app_main-content o-app_main-content--md">
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
              Manage {{ nonprofit.legalName }}'s Settings
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <section class="c-page-section c-page-section--headless c-page-section--border c-page-section--shadow c-page-section--segmented">
            <div class="c-page-section__main">
              <div class="c-page-section-segment">
                <h3 class="c-page-section-segment__title">
                  <router-link :to="{ name: 'nonprofit-settings-manage-organization' }">
                    Manage Organization Info
                  </router-link>
                </h3>
                <div class="c-notes c-notes--below">
                  Manage your organization's info, including contact info and categories.
                </div>
              </div>

              <hr class="expand">

              <div class="c-page-section-segment">
                <h3 class="c-page-section-segment__title">
                  <router-link :to="{ name: 'nonprofit-settings-donation-notifications' }">
                    Donation Notifications
                  </router-link>
                </h3>
                <div class="c-notes c-notes--below">
                  Control how often you receive donation notifications.
                </div>
              </div>

              <hr class="expand">

              <div class="c-page-section-segment">
                <h3 class="c-page-section-segment__title">
                  <router-link :to="{ name: 'nonprofit-settings-admins-list' }">
                    Manage Admins
                  </router-link>
                </h3>
                <div class="c-notes c-notes--below">
                  Invite additional individuals to help you manage your donation page.
                </div>
              </div>

              <hr class="expand">

              <div class="c-page-section-segment">
                <h3
                  v-if="nonprofit.status === 'ACTIVE'"
                  class="c-page-section-segment__title"
                >
                  <router-link :to="{ name: 'nonprofit-settings-social-sharing' }">
                    Social Sharing
                  </router-link>
                </h3>
                <h3
                  v-else
                  class="c-page-section-segment__title"
                >
                  Social Sharing
                </h3>
                <div class="c-notes c-notes--below">
                  Manage the text and image that is displayed when someone shares your page on social media.
                </div>
              </div>

              <hr
                v-if="!isAdmin"
                class="expand"
              >

              <div
                v-if="!isAdmin"
                class="c-page-section-segment"
              >
                <h3 class="c-page-section-segment__title">
                  <router-link :to="{ name: 'nonprofit-settings-request-name-change' }">
                    Request Name Change
                  </router-link>
                </h3>
                <div class="c-notes c-notes--below">
                  Fill out this form to request that your organization name be changed by the Giving Day event admin.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
        vue.nonprofit = response.data
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
      vue.nonprofit = response.data
    }).then(function () {
      next()
    }).catch(function () {
      next()
    })
  },
  props: {
    nonprofitId: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      nonprofit: {}
    }
  },
  computed: {
    isAdmin: function () {
      return this.isSuperAdminUser() || this.isAdminUser()
    }
  }
}
</script>
