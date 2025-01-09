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
    <navigation />

    <main
      id="main-content"
      class="o-app__main o-app__main--compact"
    >
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-page-header">
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Google Analytics Settings
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <paymentspring-keys-banner />

          <form @submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Google Analytics
                  </h2>
                </div>
              </header>

              <div class="c-page-section__main">
                <div
                  class="c-form-item c-form-item--text"
                  :class="{ 'c-form-item--has-error': formErrors.GOOGLE_ANALYTICS_TRACKING_ID }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="trackingId"
                      class="c-form-item-label-text"
                    >Tracking ID</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      id="trackingId"
                      v-model="formData.GOOGLE_ANALYTICS_TRACKING_ID"
                      v-auto-focus
                      type="text"
                      name="trackingId"
                      maxlength="200"
                      :class="{ 'has-error': formErrors.GOOGLE_ANALYTICS_TRACKING_ID }"
                    >
                    <div
                      v-if="formErrors.GOOGLE_ANALYTICS_TRACKING_ID"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.GOOGLE_ANALYTICS_TRACKING_ID }}
                    </div>
                    <div class="c-notes c-notes--below">
                      <a
                        href="https://support.google.com/analytics/answer/10089681?hl=en"
                        target="_blank"
                      >Click here</a> for instructions to get your Google
                      Analytics tracking ID. If you don't have a Google Analytics account, <a
                        href="https://www.google.com/analytics/"
                        target="_blank"
                      >sign up
                        for a free account</a>.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer class="c-form-actions">
              <button
                type="submit"
                class="c-btn"
              >
                Save Changes
              </button>
              <router-link
                :to="{ name: 'settings-list' }"
                class="c-btn c-btn--neutral c-btn--text"
              >
                Cancel
              </router-link>
            </footer>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Request from './../../../../helpers/request'

export default {
  beforeRouteEnter: function (to, from, next) {
    const fetchData = function () {
      const request = new Request()
      let settings = null
      let promise = Promise.resolve()

      promise = promise.then(function () {
        return request.get('settings', {
          keys: ['GOOGLE_ANALYTICS_TRACKING_ID']
        }).then(function (response) {
          settings = response.data
        })
      })

      promise = promise.then(function () {
        return {
          settings: settings
        }
      })

      return promise
    }

    fetchData().then(function (data) {
      next(function (vue) {
        vue.settings = data.settings
      })
    })
  },
  data: function () {
    return {
      settings: [],

      // Form Data
      formData: {
        GOOGLE_ANALYTICS_TRACKING_ID: ''
      },

      // Errors
      formErrors: {}

    }
  },
  watch: {
    formData: {
      handler: function () {
        const vue = this
        if (Object.keys(vue.formErrors).length) {
          vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
        }
      },
      deep: true
    },
    settings: {
      handler: function () {
        const vue = this
        if (vue.settings.length) {
          Object.keys(vue.formData).forEach(function (key) {
            const setting = _.find(vue.settings, { key: key })
            if (setting) {
              vue.formData[key] = setting.value
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    getConstraints: function () {
      return {
        GOOGLE_ANALYTICS_TRACKING_ID: {
          label: 'Tracking ID',
          presence: false
        }
      }
    },
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('spinner')

      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.clearModals()
        vue.scrollToError()
      } else {
        vue.updateSettings()
      }
    },
    updateSettings: function () {
      const vue = this

      vue.getSettingsToUpdate().then(function (settings) {
        let promise = Promise.resolve()
        const toUpdate = _.reject(settings, { value: '' })
        const toDelete = _.filter(settings, { value: '' })

        if (toUpdate.length) {
          promise = promise.then(function () {
            return vue.$request.patch('settings', {
              settings: toUpdate
            })
          })
        }

        if (toDelete.length) {
          promise = promise.then(function () {
            return vue.$request.delete('settings', {
              settings: toDelete
            })
          })
        }

        return promise
      }).then(function () {
        vue.clearModals()
        vue.$router.push({ name: 'settings-list' })
      }).catch(function (err) {
        vue.clearModals()
        console.log(err)
      })
    },
    getSettingsToUpdate: function () {
      const vue = this
      return new Promise(function (resolve, reject) {
        const settings = []
        Object.keys(vue.formData).forEach(function (key) {
          settings.push({
            key: key,
            value: vue.formData[key]
          })
        })
        resolve(settings)
      })
    }
  }
}
</script>
