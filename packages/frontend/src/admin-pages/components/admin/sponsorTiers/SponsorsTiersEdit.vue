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
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-page-header">
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'sponsor-tiers-list' }">Tiers</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Edit Sponsor Tier
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <api-error v-model="apiError" />
          <form @submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
              <div class="c-page-section__main">
                <div
                  class="c-form-item c-form-item--text c-form-item--required"
                  :class="{ 'c-form-item--has-error': formErrors.name }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="name"
                      class="c-form-item-label-text"
                    >Name</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      id="name"
                      v-model="formData.name"
                      v-auto-focus
                      type="text"
                      name="name"
                      :class="{ 'has-error': formErrors.name }"
                    >
                    <div
                      v-if="formErrors.name"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.name }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--radio">
                  <div class="c-form-item__label">
                    <div
                      id="logoSize"
                      class="c-form-item-label-text"
                    >
                      Logo Size
                    </div>
                    <div class="c-notes">
                      Specify the size of this tier's logos when they're displayed on your website. For example, if you're creating a "Featured Sponsors" tier, you can make its logos larger than your other tiers.
                    </div>
                  </div>

                  <div class="c-form-item__control">
                    <div
                      v-if="formErrors.size"
                      class="c-notes c-notes--above c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.size }}
                    </div>
                    <ul
                      class="c-input-list c-input-list--radio"
                      aria-labelledby="logoSize"
                    >
                      <li>
                        <input
                          id="logoSize-1"
                          v-model="formData.size"
                          type="radio"
                          name="logoSize"
                          value="LARGE"
                        >
                        <label for="logoSize-1">Large</label>
                      </li>
                      <li>
                        <input
                          id="logoSize-2"
                          v-model="formData.size"
                          type="radio"
                          name="logoSize"
                          value="DEFAULT"
                        >
                        <label for="logoSize-2">Default</label>
                      </li>
                      <li>
                        <input
                          id="logoSize-3"
                          v-model="formData.size"
                          type="radio"
                          name="logoSize"
                          value="SMALL"
                        >
                        <label for="logoSize-3">Small</label>
                      </li>
                    </ul>
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
                :to="{name:'sponsor-tiers-list'}"
                class="c-btn c-btn--text c-btn--neutral"
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
export default {
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('sponsor-tiers/' + vue.sponsorTierId).then(function (response) {
        vue.sponsorTier = response.data
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.$request.get('sponsor-tiers/' + vue.sponsorTierId).then(function (response) {
      vue.sponsorTier = response.data
      next()
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
      next()
    })
  },
  props: {
    sponsorTierId: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      sponsorTier: {},

      // Form Data
      formData: {
        name: '',
        size: ''
      },

      // Errors
      formErrors: {},
      apiError: {}
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
    sponsorTier: {
      handler: function () {
        const vue = this
        vue.formData = vue.sync(vue.formData, vue.sponsorTier)
      },
      deep: true
    }
  },
  methods: {
    getConstraints: function () {
      return {
        name: {
          presence: true
        },
        size: {
          label: 'Logo size',
          presence: true,
          inclusion: ['LARGE', 'DEFAULT', 'SMALL']
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
      } else {
        vue.updateSponsorTier()
      }
    },
    updateSponsorTier: function () {
      const vue = this

      const params = vue.getUpdatedParameters(vue.formData, vue.sponsorTier)
      if (Object.keys(params).length === 0) {
        vue.clearModals()
        return
      }

      vue.$request.patch('sponsor-tiers/' + vue.sponsorTierId, params).then(function (response) {
        vue.clearModals()
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          vue.$router.push({ name: 'sponsor-tiers-list' })
        }
      }).catch(function (err) {
        vue.clearModals()
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
