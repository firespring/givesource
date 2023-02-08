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
      <div class="o-app_main-content o-app_main-content--md">
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
              Manage {{ nonprofit.legalName }}'s Social Sharing Settings
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
              Social Sharing Settings
            </h1>
          </div>
        </div>

        <form @submit.prevent="submit">
          <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
            <header class="c-page-section__header">
              <div class="c-page-section-header-text">
                <h2 class="c-page-section-title">
                  Social Sharing
                </h2>
                <div class="c-notes c-notes--below">
                  This content will be used when someone shares your donation page via social media.
                </div>
              </div>
            </header>

            <div class="c-page-section__main">
              <div
                class="c-form-item c-form-item--file c-form-item--file-picker"
                :class="{ 'c-form-item--has-error': formErrors.socialSharingImage }"
              >
                <div class="c-form-item__label">
                  <label
                    for="socialSharingImage"
                    class="c-form-item-label-text"
                  >Social Image</label>

                  <div class="c-notes">
                    This image will appear when your donation page is shared via social media.
                  </div>
                </div>
                <forms-image-editor
                  id="socialSharingImage"
                  v-model="formData.socialSharingImage"
                  name="socialSharingImage"
                />
                <div
                  v-if="formErrors.socialSharingImage"
                  class="c-notes c-notes--below c-notes--bad c-form-control-error"
                >
                  {{ formErrors.socialSharingImage }}
                </div>
              </div>

              <div
                class="c-form-item c-form-item--textarea"
                :class="{ 'c-form-item--has-error': formErrors.socialSharingDescription }"
              >
                <div class="c-form-item__label">
                  <label
                    for="socialSharingDescription"
                    class="c-form-item-label-text"
                  >Social Sharing Description</label>

                  <div class="c-notes">
                    This description will appear when your event is shared via social media.
                  </div>
                </div>
                <div class="c-form-item__control">
                  <textarea
                    id="socialSharingDescription"
                    v-model="formData.socialSharingDescription"
                    name="socialSharingDescription"
                    :class="{ 'has-error': formErrors.socialSharingDescription }"
                    maxlength="2048"
                  />
                  <div
                    v-if="formErrors.socialSharingDescription"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.socialSharingDescription }}
                  </div>
                </div>
              </div>

              <div
                v-if="displayPreview"
                class="c-form-item"
              >
                <div class="c-form-item__label">
                  <label class="c-form-item-label-text">Preview</label>

                  <div class="c-notes">
                    This is an example how your event may appear when shared via social media.
                  </div>
                </div>
                <div class="c-form-item__control">
                  <social-card
                    :description="previewDescription"
                    :event_title="settings.EVENT_TITLE"
                    :fallback_image="settings.SOCIAL_SHARING_IMAGE"
                    :image="formData.socialSharingImage"
                    :title="previewTitle"
                    :url="previewUrl"
                  />
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
              :to="{ name: 'nonprofit-settings-list' }"
              class="c-btn c-btn--neutral c-btn--text"
            >
              Cancel
            </router-link>
          </footer>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import ComponentImageEditor from './../../../forms/ImageEditor.vue'
import ComponentSelectNonprofitCategory from './../../../forms/SelectNonprofitCategory.vue'
import ComponentSelectState from './../../../forms/SelectState.vue'
import ComponentSocialCard from './../../../media/SocialCard.vue'

export default {
  components: {
    'forms-image-editor': ComponentImageEditor,
    'category-select': ComponentSelectNonprofitCategory,
    'state-select': ComponentSelectState,
    'social-card': ComponentSocialCard
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$request.get('/nonprofits/' + to.params.nonprofitId).then(response => {
        vm.nonprofit = response.data
        return vm.loadSettings()
      })
    })
  },
  beforeRouteUpdate (to, from, next) {
    const vm = this

    vm.$request.get('/nonprofits/' + to.params.nonprofitId).then(response => {
      vm.nonprofit = response.data
      return vm.loadSettings()
    }).catch(() => {
      next()
    })
  },
  props: [
    'nonprofitId'
  ],
  data () {
    return {
      nonprofit: {},
      loaded: false,

      formData: {
        socialSharingDescription: '',
        socialSharingFileId: 0,
        socialSharingImage: null
      },

      settings: {
        EVENT_TITLE: '',
        EVENT_URL: '',
        SOCIAL_SHARING_DESCRIPTION: '',
        SOCIAL_SHARING_IMAGE: null
      },

      // Errors
      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    displayPreview () {
      return this.previewDescription || this.previewFallbackImage || this.settings.socialSharingImage || this.previewUrl || this.previewTitle
    },
    isAdmin () {
      return this.isSuperAdminUser() || this.isAdminUser()
    },
    previewDescription () {
      return this.formData.socialSharingDescription ? this.formData.socialSharingDescription : this.settings.SOCIAL_SHARING_DESCRIPTION
    },
    previewTitle () {
      return this.settings.EVENT_TITLE ? 'Support ' + this.nonprofit.legalName + ' at ' + this.settings.EVENT_TITLE : this.nonprofit.legalName
    },
    previewUrl () {
      return this.settings.EVENT_URL + '/nonprofits/' + this.nonprofit.slug
    }
  },
  watch: {
    formData: {
      handler () {
        const vm = this
        if (Object.keys(vm.formErrors).length) {
          vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
        }
      },
      deep: true
    },
    nonprofit: {
      handler () {
        const vm = this

        vm.formData = vm.sync(vm.formData, vm.nonprofit)
        if (vm.formData.socialSharingFileId > 0) {
          vm.$request.get('files/' + vm.formData.socialSharingFileId).then(response => {
            vm.formData.socialSharingImage = response.data
          }).catch(() => {
            vm.formData.socialSharingImage = null
          })
        } else {
          vm.formData.socialSharingImage = null
        }
        vm.loaded = true
        vm.removeModal('spinner')
      },
      deep: true
    }
  },
  created () {
    this.addModal('spinner')
  },
  methods: {
    loadSettings () {
      const vm = this
      return vm.$request.get('/settings', {
        keys: Object.keys(vm.settings)
      }).then(response => {
        response.data.forEach(setting => {
          if (vm.settings.hasOwnProperty(setting.key)) {
            if (!vm.isFileSetting(setting.key)) {
              vm.settings[setting.key] = setting.value
            } else {
              if (setting.value) {
                vm.$request.get('files/' + setting.value).then(response => {
                  vm.settings[setting.key] = response.data
                }).catch(() => {
                  vm.settings[setting.key] = null
                })
              }
            }
          }
        })
      }).catch(err => {
        vm.apiError = err.response.data.errors
      })
    },
    isFileSetting (key) {
      const fileKeys = ['SOCIAL_SHARING_IMAGE']
      return _.includes(fileKeys, key)
    },
    getConstraints () {
      return {
        socialSharingDescription: {
          presence: false
        },
        socialSharingImage: {
          presence: false,
          image: true
        }
      }
    },
    submit () {
      const vm = this

      vm.addModal('spinner')

      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      if (Object.keys(vm.formErrors).length) {
        vm.clearModals()
      } else {
        vm.updateNonprofit()
      }
    },
    updateNonprofit () {
      const vm = this

      vm.getUpdatedNonprofitParams().then(updatedParams => {
        let promise = Promise.resolve()
        const originalSocialSharingFileId = vm.nonprofit.socialSharingFileId

        if (Object.keys(updatedParams).length) {
          promise = promise.then(() => {
            return vm.$request.patch('nonprofits/' + vm.nonprofit.id, updatedParams).then(response => {
              if (response.data.errorMessage) {
                console.log(response.data)
              }
              vm.$emit('updateNonprofit', response.data[0])
            })
          })
        }

        if (updatedParams.hasOwnProperty('socialSharingFileId') && !_.isEmpty(originalSocialSharingFileId)) {
          promise = promise.then(() => {
            return vm.$request.delete('files/' + originalSocialSharingFileId)
          })
        }

        promise.then(() => {
          vm.clearModals()
          vm.$router.push({ name: 'nonprofit-settings-list' })
        })

        return promise
      }).catch(err => {
        vm.clearModals()
        vm.apiError = err.response.data.errors
      })
    },
    getUpdatedNonprofitParams () {
      const vm = this
      let promise = Promise.resolve()

      if (vm.formData.socialSharingImage instanceof File) {
        promise = promise.then(() => {
          return vm.uploadImage('socialSharingImage').then(uploadedFile => {
            vm.$store.commit('generateCacheKey')
            vm.formData.socialSharingFileId = uploadedFile && uploadedFile.hasOwnProperty('id') ? uploadedFile.id : ''
          })
        })
      } else if (_.isPlainObject(vm.formData.socialSharingImage) && vm.formData.socialSharingImage.hasOwnProperty('id')) {
        vm.formData.socialSharingFileId = vm.formData.socialSharingImage.id
      } else {
        vm.formData.socialSharingFileId = ''
      }

      promise = promise.then(() => {
        const params = vm.getUpdatedParameters(vm.formData, vm.nonprofit)
        delete params.socialSharingImage
        return params
      })

      return promise
    },
    uploadImage (key) {
      const vm = this
      let file = null
      let promise = Promise.resolve()
      if (vm.formData[key]) {
        promise = promise.then(() => {
          return vm.$request.post('files', {
            content_type: vm.formData[key].type,
            filename: vm.formData[key].name
          })
        }).then(response => {
          file = response.data.file
          const signedUrl = response.data.upload_url

          const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers))
          const instance = axios.create()
          instance.defaults.headers.common['Content-Type'] = vm.formData[key].type || 'application/octet-stream'
          instance.defaults.headers.put['Content-Type'] = vm.formData[key].type || 'application/octet-stream'
          axios.defaults.headers = defaultHeaders
          return instance.put(signedUrl, vm.formData[key])
        }).then(() => {
          return file
        })
      }
      return promise
    }
  }
}
</script>
