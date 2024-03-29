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
              <span><router-link :to="{ name: 'sponsors-list' }">{{ sponsorTier.name }}</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Add Sponsor
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
                      maxlength="90"
                    >
                    <div
                      v-if="formErrors.name"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.name }}
                    </div>
                  </div>
                </div>

                <div
                  class="c-form-item c-form-item--url"
                  :class="{ 'c-form-item--has-error': formErrors.url }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="url"
                      class="c-form-item-label-text"
                    >URL</label>
                  </div>
                  <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--url">
                      <input
                        id="url"
                        v-model="formData.url"
                        type="url"
                        name="url"
                        placeholder="https://"
                      >
                      <div
                        v-if="formErrors.url"
                        class="c-notes c-notes--below c-notes--bad c-form-control-error"
                      >
                        {{ formErrors.url }}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="c-form-item c-form-item--select"
                  :class="{ 'c-form-item--has-error': formErrors.sponsorTierId }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="sponsorTier"
                      class="c-form-item-label-text"
                    >Tier</label>
                  </div>
                  <div class="c-form-item__control">
                    <forms-sponsor-tier
                      id="sponsorTier"
                      v-model="formData.sponsorTierId"
                      :sponsor-tiers="sponsorTiers"
                      name="sponsorTier"
                      class="u-width-auto"
                      :class="{ 'c-form-item--has-error': formErrors.sponsorTierId }"
                    />
                    <div
                      v-if="formErrors.sponsorTierId"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.sponsorTierId }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                  <div class="c-form-item__label">
                    <label
                      for="fileFieldDefault"
                      class="c-form-item-label-text"
                    >Logo</label>
                    <div class="c-notes">
                      If no logo is uploaded, one will be automatically generated based on the sponsor's name.
                    </div>
                  </div>
                  <forms-image-upload v-model="formData.file" />
                  <div
                    v-if="formErrors.file"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.file }}
                  </div>
                </div>
              </div>
            </section>

            <footer class="c-form-actions">
              <button
                type="submit"
                class="c-btn"
                @click="save('add')"
              >
                Save &amp; Add Another
              </button>
              <button
                type="submit"
                class="c-btn"
                @click="save('close')"
              >
                Save &amp; Finish
              </button>
              <router-link
                :to="{name:'sponsors-list'}"
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
import ComponentImageUpload from './../../../forms/ImageUpload.vue'
import ComponentSponsorTier from './../../../forms/SponsorTier.vue'

export default {
  components: {
    'forms-image-upload': ComponentImageUpload,
    'forms-sponsor-tier': ComponentSponsorTier
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('sponsor-tiers').then(function (response) {
        response.data.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        vue.sponsorTiers = response.data
        vue.sponsorTier = _.find(vue.sponsorTiers, { id: parseInt(to.params.sponsorTierId) })
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.$request.get('sponsor-tiers').then(function (response) {
      response.data.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      vue.sponsorTiers = response.data
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
      sponsorTiers: [],
      sponsorTier: {},

      // Form Data
      formData: {
        file: null,
        name: null,
        sponsorTierId: this.sponsorTierId ? this.sponsorTierId : null,
        url: ''
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
    }
  },
  methods: {
    getConstraints: function () {
      return {
        file: {
          presence: false,
          image: true
        },
        name: {
          presence: true
        },
        sponsorTierId: {
          label: 'Tier',
          presence: true
        },
        url: {
          presence: false,
          url: true
        }
      }
    },
    submit: function (event) {
      event.preventDefault()
    },
    save: function (action) {
      const vue = this

      vue.addModal('spinner')

      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.clearModals()
      } else {
        vue.addSponsor(action)
      }
    },
    addSponsor: function (action) {
      const vue = this

      let file = null
      let promise = Promise.resolve()
      if (vue.formData.file) {
        promise = promise.then(function () {
          return vue.$request.post('files', {
            content_type: vue.formData.file.type,
            filename: vue.formData.file.name
          })
        }).then(function (response) {
          file = response.data.file
          const signedUrl = response.data.upload_url

          const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers))
          const instance = axios.create()
          instance.defaults.headers.common['Content-Type'] = vue.formData.file.type || 'application/octet-stream'
          instance.defaults.headers.put['Content-Type'] = vue.formData.file.type || 'application/octet-stream'
          axios.defaults.headers = defaultHeaders
          return instance.put(signedUrl, vue.formData.file)
        })
      }

      promise.then(function () {
        return vue.$request.post('sponsor-tiers/' + vue.formData.sponsorTierId + '/sponsors', {
          fileId: file && file.hasOwnProperty('id') ? file.id : 0,
          name: vue.formData.name,
          sponsorTierId: vue.formData.sponsorTierId,
          url: vue.formData.url
        })
      }).then(function (response) {
        vue.$store.commit('generateCacheKey')
        vue.clearModals()
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          if (action === 'add') {
            vue.formData = {
              file: null,
              name: null,
              sponsorTierId: vue.sponsorTierId,
              url: null
            }
          } else {
            vue.$router.push({ name: 'sponsors-list' })
          }
        }
      }).catch(function (err) {
        vue.clearModals()
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
