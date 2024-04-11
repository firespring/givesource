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
              <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Site Appearance
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <paymentspring-keys-banner />

          <api-error v-model="apiError" />

          <form @submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Logos, Images &amp; Color
                  </h2>
                </div>
              </header>

              <div class="c-page-section__main">
                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                  <div class="c-form-item__label">
                    <label
                      for="givingDayLogo"
                      class="c-form-item-label-text"
                    >Giving Day Event Logo</label>
                  </div>
                  <forms-image-upload
                    id="givingDayLogo"
                    v-model="formData.EVENT_LOGO"
                    name="givingDayLogo"
                  />
                  <div class="c-notes c-notes--below u-width-100p">
                    Your Giving Day event's logo will be displayed on all pages. It will be automatically resized as needed.
                  </div>
                  <div
                    v-if="formErrors.EVENT_LOGO"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.EVENT_LOGO }}
                  </div>
                </div>

                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                  <div class="c-form-item__label">
                    <label
                      for="foundationLogo"
                      class="c-form-item-label-text"
                    >Your Foundation's Logo</label>
                  </div>
                  <forms-image-upload
                    id="foundationLogo"
                    v-model="formData.FOUNDATION_LOGO"
                    name="foundationLogo"
                  />
                  <div class="c-notes c-notes--below u-width-100p">
                    Your foundation logo will be displayed in a "Presented By" slot throughout your Giving Day site. Logos are automatically resized as needed.
                  </div>
                  <div
                    v-if="formErrors.FOUNDATION_LOGO"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.FOUNDATION_LOGO }}
                  </div>
                </div>

                <div class="c-form-item c-form-item--url">
                  <div class="c-form-item__label">
                    <label
                      for="foundationUrl"
                      class="c-form-item-label-text"
                    >Foundation Logo Link</label>
                  </div>

                  <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--url">
                      <input
                        id="foundationUrl"
                        v-model="formData.FOUNDATION_URL"
                        type="url"
                        name="foundationUrl"
                        placeholder="https://"
                      >
                    </div>
                    <div class="c-notes c-notes--below">
                      Enter a URL that you want your foundation logo to link to (e.g., your foundation's website).
                    </div>
                    <div
                      v-if="formErrors.FOUNDATION_URL"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.FOUNDATION_URL }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                  <div class="c-form-item__label">
                    <label
                      for="backgroundMasthead"
                      class="c-form-item-label-text"
                    >Masthead Background</label>
                  </div>
                  <forms-image-upload
                    id="backgroundMasthead"
                    v-model="formData.MASTHEAD_IMAGE"
                    name="backgroundMasthead"
                  />
                  <div class="c-notes c-notes--below u-width-100p">
                    This image will appear in the masthead of your page as a background image. We recommend using an image that's 1200x1200 or larger. Grayscale
                    or duotone images work best.
                  </div>
                  <div
                    v-if="formErrors.MASTHEAD_IMAGE"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.MASTHEAD_IMAGE }}
                  </div>
                </div>

                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                  <div class="c-form-item__label">
                    <label
                      for="faviconImage"
                      class="c-form-item-label-text"
                    >Favicon</label>
                  </div>
                  <forms-image-upload
                    id="faviconImage"
                    v-model="formData.FAVICON"
                    name="faviconImage"
                  />
                  <div class="c-notes c-notes--below u-width-100p">
                    This image will appear next to the website's title in the user's browser, as well as in their bookmarks list. Favicons should be 64x64.
                    For more information on creating a favicon,
                    <a
                      href="http://blog.teamtreehouse.com/how-to-make-a-favicon"
                      target="_blank"
                      rel="noreferrer noopener"
                    >click here</a>.
                  </div>
                  <div
                    v-if="formErrors.FAVICON"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.FAVICON }}
                  </div>
                </div>

                <div class="c-form-item c-form-item--color">
                  <div class="c-form-item__label">
                    <label
                      for="accentColor"
                      class="c-form-item-label-text"
                    >Accent Color</label>
                  </div>
                  <div class="c-form-item__control">
                    <forms-color
                      id="accentColor"
                      v-model="formData.ACCENT_COLOR"
                      name="accentColor"
                      :default-color="defaultColor"
                    />
                    <div class="c-notes c-notes--below">
                      Customize the look of your page with an accent color.
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
import ComponentColor from './../../../forms/Color.vue'
import ComponentImageUpload from './../../../forms/ImageUpload.vue'

export default {
  components: {
    'forms-color': ComponentColor,
    'forms-image-upload': ComponentImageUpload
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('settings', {
        keys: Object.keys(vue.formData)
      }).then(function (response) {
        vue.settings = response.data
      })
    })
  },
  data: function () {
    return {
      settings: [],

      defaultColor: '#0098d8',

      // Form Data
      formData: {
        ACCENT_COLOR: '',
        EVENT_LOGO: null,
        FAVICON: null,
        FOUNDATION_LOGO: null,
        FOUNDATION_URL: '',
        MASTHEAD_IMAGE: null
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
    settings: {
      handler: function () {
        const vue = this
        if (vue.settings.length) {
          Object.keys(vue.formData).forEach(function (key) {
            const setting = _.find(vue.settings, { key: key })
            if (setting) {
              if (!vue.isFileSetting(key)) {
                vue.formData[key] = setting.value
              } else {
                if (setting.value) {
                  vue.$request.get('files/' + setting.value).then(function (response) {
                    vue.formData[key] = response.data
                  }).catch(function () {
                    vue.formData[key] = null
                  })
                }
              }
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
        ACCENT_COLOR: {
          label: 'Accent Color'
        },
        EVENT_LOGO: {
          presence: false,
          image: true
        },
        FAVICON: {
          presence: false,
          favicon: true
        },
        FOUNDATION_LOGO: {
          presence: false,
          image: true
        },
        FOUNDATION_URL: {
          presence: false,
          label: 'Foundation Logo Link',
          url: true
        },
        MASTHEAD_IMAGE: {
          presence: false,
          image: true
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
        vue.updateSettings()
      }
    },
    updateSettings: function () {
      const vue = this

      vue.getSettingsToUpdate().then(function (settings) {
        const toUpdate = _.reject(settings, function (setting) {
          return (setting.value === '' || setting.value === null)
        })
        const toDelete = _.filter(settings, function (setting) {
          return (setting.value === '' || setting.value === null)
        })

        vue.$request.patch('settings', {
          settings: toUpdate
        }).then(function (response) {
          if (response.data.errorMessage) {
            console.log(response.data)
          }
          return vue.$request.delete('settings', {
            settings: toDelete
          })
        }).then(function (response) {
          if (response.data.errorMessage) {
            console.log(response.data)
          }

          // delete files that were replace or removed
          const filesToDelete = []
          _.forEach(settings, function (setting) {
            if (vue.isFileSetting(setting.key)) {
              const originalSetting = _.find(vue.settings, { key: setting.key })
              if (originalSetting && originalSetting.value !== setting.value && originalSetting.value !== '' && originalSetting.value !== null) {
                filesToDelete.push(originalSetting.value)
              }
            }
          })

          if (filesToDelete.length > 0) {
            return vue.$request.delete('files', {
              files: filesToDelete
            })
          }

          return Promise.resolve()
        }).then(function () {
          vue.clearModals()
          vue.$router.push({ name: 'settings-list' })
        }).catch(function (err) {
          vue.clearModals()
          vue.apiError = err.response.data.errors
        })
      })
    },
    getSettingsToUpdate: function () {
      const vue = this
      const settings = []
      let promise = Promise.resolve()
      Object.keys(vue.formData).forEach(function (key) {
        if (vue.formData[key] instanceof File) {
          promise = promise.then(function () {
            return vue.uploadImage(key).then(function (uploadedFile) {
              vue.$store.commit('generateCacheKey')
              settings.push({
                key: key,
                value: uploadedFile && uploadedFile.hasOwnProperty('id') ? uploadedFile.id.toString() : ''
              })
            })
          })
        } else {
          promise = promise.then(function () {
            let settingValue = vue.formData[key]
            if (key === 'ACCENT_COLOR' && vue.formData[key] === vue.defaultColor) {
              settingValue = ''
            } else if (_.isPlainObject(vue.formData[key]) && vue.formData[key].hasOwnProperty('id')) {
              settingValue = vue.formData[key].id
            }
            settings.push({
              key: key,
              value: settingValue !== null ? settingValue.toString() : settingValue
            })
          })
        }
      })

      promise = promise.then(function () {
        return settings
      })

      return promise
    },
    uploadImage: function (key) {
      const truncateFileName = (name) => {
        // we only store 50 chars of the filename in the database
        // so if it is longer we need to truncate it, but we also need to keep the file extension intact
        if (name.length <= 50) return name
        const parts = name.split('.')
        const ext = parts.pop()
        const filename = parts
          .join('.') // put remain filename parts back
          .slice(0, 50 - ext.length - 1) // slice to 50chars, minus extension length, minus 1 for period before extension
          .replace(/\.$/, '') // if we are left with a period at the end, trim it

        return `${filename}.${ext}`
      }
      const vue = this
      let file = null
      let promise = Promise.resolve()
      if (vue.formData[key]) {
        promise = promise.then(function () {
          return vue.$request.post('files', {
            content_type: vue.formData[key].type,
            filename: truncateFileName(vue.formData[key].name)
          })
        }).then(function (response) {
          file = response.data.file
          const signedUrl = response.data.upload_url

          const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers))
          const instance = axios.create()
          instance.defaults.headers.common['Content-Type'] = vue.formData[key].type || 'application/octet-stream'
          instance.defaults.headers.put['Content-Type'] = vue.formData[key].type || 'application/octet-stream'
          axios.defaults.headers = defaultHeaders
          return instance.put(signedUrl, vue.formData[key])
        }).then(function () {
          return file
        })
      }
      return promise
    },
    isFileSetting (settingKey) {
      const fileKeys = ['EVENT_LOGO', 'FAVICON', 'FOUNDATION_LOGO', 'MASTHEAD_IMAGE']
      return _.includes(fileKeys, settingKey)
    }
  }
}
</script>
