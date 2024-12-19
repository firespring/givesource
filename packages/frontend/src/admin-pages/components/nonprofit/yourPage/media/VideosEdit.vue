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
    <main id="main-content" class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <api-error v-model="apiError" />

        <div
          v-if="isAdmin"
          class="o-page-header"
        >
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
              <span v-if="nonprofit.legalName"><router-link :to="{ name: 'nonprofit-your-page'}">Manage {{ nonprofit.legalName }}'s Donation Page</router-link></span>
              <span v-else><router-link :to="{ name: 'nonprofit-your-page'}">Manage Donation Page</router-link></span>
              <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
            </nav>
            <h1
              v-if="nonprofit.legalName"
              class="o-page-header-title"
            >
              {{ nonprofit.legalName }} - Edit Video
            </h1>
          </div>
        </div>

        <div
          v-else
          class="o-page-header"
        >
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'nonprofit-your-page'}">Manage Donation Page</router-link></span>
              <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Edit Video
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <form @submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
              <div class="c-page-section__main">
                <div class="c-form-item">
                  <div class="c-form-item__label">
                    <strong>Preview</strong>
                  </div>
                  <media-video
                    :url="formData.url"
                    :width="770"
                    :height="443"
                  />
                </div>

                <div
                  class="c-form-item c-form-item--url"
                  :class="{ 'c-form-item--has-error': formErrors.url }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="url"
                      class="c-form-item-label-text"
                    >Video URL</label>
                  </div>
                  <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--url">
                      <input
                        id="url"
                        v-model="formData.url"
                        v-auto-focus
                        type="url"
                        name="url"
                        placeholder="https://"
                        :class="{ 'has-error': formErrors.url }"
                      >
                    </div>
                    <div
                      v-if="formErrors.url"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.url }}
                    </div>
                    <div class="c-notes c-notes--below">
                      Only YouTube and Vimeo URLs are allowed.
                    </div>
                  </div>
                </div>

                <!--<div class="c-form-item c-form-item&#45;&#45;text" :class="{ 'c-form-item&#45;&#45;has-error': formErrors.caption }">-->
                <!--<div class="c-form-item__label">-->
                <!--<label for="caption" class="c-form-item-label-text">Caption (100 characters or less)</label>-->
                <!--</div>-->
                <!--<div class="c-form-item__control">-->
                <!--<input v-model="formData.caption" type="text" name="caption" id="caption" maxlength="100" :class="{ 'has-error': formErrors.caption }">-->
                <!--<div v-if="formErrors.caption" class="c-notes c-notes&#45;&#45;below c-notes&#45;&#45;bad c-form-control-error">-->
                <!--{{ formErrors.caption }}-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
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
                :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}"
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
import ComponentVideo from './../../../media/Video.vue'
import Media from './../../../../helpers/media'

export default {
  components: {
    'media-video': ComponentVideo
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
        vue.nonprofit = response.data
        return vue.$request.get('nonprofits/' + to.params.nonprofitId + '/slides/' + to.params.slideId)
      }).then(function (response) {
        vue.slide = response.data
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
      vue.nonprofit = response.data
      return vue.$request.get('nonprofits/' + to.params.nonprofitId + '/slides/' + to.params.slideId)
    }).then(function (response) {
      vue.slide = response.data
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
      slide: {},
      nonprofit: {},

      // Form Data
      formData: {
        url: '',
        caption: ''
      },

      // Errors
      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    isAdmin: function () {
      return this.isSuperAdminUser() || this.isAdminUser()
    }
  },
  watch: {
    formData: {
      handler: function () {
        const vue = this
        if (Object.keys(vue.formErrors).length) {
          vue.slide = vue.validate(vue.formData, vue.getConstraints())
        }
      },
      deep: true
    },
    slide: {
      handler: function () {
        const vue = this
        vue.formData = vue.sync(vue.formData, vue.slide)
      },
      deep: true
    }
  },
  methods: {
    getConstraints: function () {
      return {
        url: {
          presence: true,
          url: true,
          label: 'Video URL',
          format: {
            pattern: Media.VIDEO_REGEX,
            message: 'must be a Youtube or Vimeo URL.'
          }
        },
        caption: {
          presence: false,
          length: {
            maximum: 100
          }
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
        vue.updateNonprofitSlide()
      }
    },
    updateNonprofitSlide: function () {
      const vue = this

      const params = vue.getUpdatedParameters(vue.formData, vue.slide)
      if (Object.keys(params).length === 0) {
        vue.clearModals()
        vue.$router.push({ name: 'nonprofit-your-page', query: { tab: 'media' } })
        return
      }

      Media.getVideoData(vue.formData.url).then(function (videoData) {
        if (params.hasOwnProperty('url')) {
          params.embedUrl = videoData.embedUrl
          params.externalId = videoData.id
          params.thumbnail = videoData.thumbnail
        }
        return vue.$request.patch('nonprofits/' + vue.nonprofitId + '/slides/' + vue.slide.id, params)
      }).then(function (response) {
        vue.clearModals()
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          vue.$router.push({ name: 'nonprofit-your-page', query: { tab: 'media' } })
        }
      }).catch(function (err) {
        vue.clearModals()
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
