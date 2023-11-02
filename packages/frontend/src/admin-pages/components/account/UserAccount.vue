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
        <div class="o-app_main-content o-app_main-content--md">
          <div class="o-app-main-content ">
            <div
              v-if="firstName"
              class="o-page-header"
            >
              <div class="o-page-header__text">
                <h1 class="o-page-header-title">
                  Hi, {{ firstName }}!
                </h1>
                From here, you can modify the various aspects of your account.
              </div>
            </div>

            <section class="c-page-section c-page-section--border c-page-section--shadow">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2
                    id="section-your-info"
                    class="c-page-section-title"
                  >
                    Your Info
                  </h2>
                </div>
                <div class="c-page-section-header-actions">
                  <button
                    class="c-btn c-btn--xs c-btn--flat c-btn--icon"
                    @click="editUserInfo"
                  >
                    <i
                      class="fa fa-pencil"
                      aria-hidden="true"
                    />Edit
                  </button>
                </div>
              </header>
              <div class="c-page-section__main">
                <div class="c-page-section-segment">
                  <h4 class="u-margin-none">
                    Name
                  </h4>
                  <div class="u-break-word">
                    {{ firstName }} {{ lastName }}
                  </div>
                </div>
              </div>
            </section>

            <section class="c-page-section c-page-section--border c-page-section--shadow">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2
                    id="section-password-security"
                    class="c-page-section-title"
                  >
                    Password &amp; Security
                  </h2>
                </div>
              </header>
              <div class="c-page-section__main">
                <div class="c-page-section-segment o-grid o-grid--sm-middle">
                  <div class="o-grid-col o-grid-col--sm-expand">
                    <h4 class="u-margin-none">
                      Password
                    </h4>
                    <div class="u-break-word">
                      ********
                    </div>
                  </div>
                  <div class="o-grid-col o-grid-col--sm-shrink">
                    <button
                      class="c-btn c-btn--xs c-btn--flat c-btn--icon"
                      @click="editPassword"
                    >
                      <i
                        class="fa fa-pencil"
                        aria-hidden="true"
                      />Edit
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div class="u-margin-top-scale">
              <button
                class="c-btn c-btn--sm c-btn--bad c-btn--icon c-btn--text"
                @click="deleteAccount"
              >
                <i
                  class="fa fa-fw fa-trash"
                  aria-hidden="true"
                />Delete Your Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      firstName: this.user.firstName || '',
      lastName: this.user.lastName || '',
      nonprofitId: this.user.nonprofitId
    }
  },
  created: function () {
    const vue = this

    vue.emitter.on('userAccountUpdateInfo', function (data) {
      vue.firstName = data.firstName
      vue.lastName = data.lastName
    })
  },
  beforeDestroy: function () {
    const vue = this

    vue.emitter.off('userAccountUpdateInfo')
  },
  methods: {
    editUserInfo: function () {
      this.addModal('account-edit-info')
    },
    editPassword: function () {
      this.addModal('account-edit-password')
    },
    deleteAccount: function (event) {
      // TODO: Delete User Account
    }
  }
}
</script>
