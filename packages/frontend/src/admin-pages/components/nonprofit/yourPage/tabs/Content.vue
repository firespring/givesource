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
  <div class="c-page-section__content">
    <api-error v-model="apiError" />

    <form @submit="submit">
      <div class="c-form-item c-form-item--text">
        <div class="c-form-item__label">
          <label
            for="slug"
            class="c-form-item-label-text"
          >Page URL</label>
        </div>
        <div class="c-form-item__control">
          <div
            v-if="editSlug"
            class="c-form-control-grid u-items-center"
          >
            <div class="c-form-control-grid__item u-flex-collapse">
              <label for="slug"><strong>{{ pageLink }}</strong></label>
            </div>
            <div class="c-form-control-grid__item u-flex-expand">
              <input
                id="slug"
                v-model="formData.slug"
                type="text"
                name="slug"
                @change="slugMask"
              >
            </div>
          </div>
          <div
            v-if="editSlug"
            class="c-notes c-notes--below"
          >
            Note: Changing your page's URL will break existing bookmarks and links to your page.
          </div>

          <div
            v-if="!editSlug"
            class="c-form-control-grid u-items-center"
          >
            <div class="c-form-control-grid__item u-flex-collapse">
              {{ pageLink }}{{ nonprofit.slug }}
            </div>
            <div class="c-form-control-grid__item u-flex-collapse">
              <a
                href="#"
                class="c-btn c-btn--xs c-btn--flat c-btn--neutral"
                @click="changeSlug"
              >Change</a>
            </div>
          </div>
        </div>
      </div>

      <div class="c-form-item c-form-item--file c-form-item--file-picker">
        <div class="c-form-item__label">
          <label
            for="pageLogo"
            class="c-form-item-label-text"
          >Page Logo</label>
        </div>

        <div class="c-form-item__control u-flex-wrap">
          <forms-image-upload
            id="pageLogo"
            v-model="formData.logo"
            name="pageLogo"
          />
          <div class="c-notes c-notes--below u-width-100p">
            Your logo will be automatically resized to fit the design.
          </div>
          <div
            v-if="formErrors.logo"
            class="c-notes c-notes--below c-notes--bad c-form-control-error"
          >
            {{ formErrors.logo }}
          </div>
        </div>
      </div>

      <div class="c-form-item c-form-item--text">
        <div class="c-form-item__label">
          <label
            for="shortDescription"
            class="c-form-item-label-text"
          >Short Description (Up to 200 characters)</label>
        </div>
        <div class="c-form-item__control">
          <input
            id="shortDescription"
            v-model="formData.shortDescription"
            type="text"
            name="shortDescription"
            maxlength="200"
            :class="{ 'has-error': formErrors.shortDescription }"
          >
          <div
            v-if="formErrors.shortDescription"
            class="c-notes c-notes--below c-notes--bad c-form-control-error"
          >
            {{ formErrors.shortDescription }}
          </div>
        </div>
      </div>

      <div class="c-form-item c-form-item--rich-text">
        <div class="c-form-item__label">
          <label
            for="longDescription"
            class="c-form-item-label-text"
          >Long Description</label>
        </div>
        <div class="c-form-item__control">
          <div class="c-notes c-notes--above">
            Describe the non-profit's mission, purpose, and goals for the giving day.
          </div>
          <forms-ckeditor
            id="longDescription"
            v-model="formData.longDescription"
            :loaded="loaded"
            :has-errors="formErrors.longDescription"
            type="moderate"
          />
          <div
            v-if="formErrors.longDescription"
            class="c-notes c-notes--below c-notes--bad c-form-control-error"
          >
            {{ formErrors.longDescription }}
          </div>
        </div>
      </div>

      <footer class="c-form-actions">
        <button
          type="submit"
          class="c-btn c-btn--flat"
        >
          Save Changes
        </button>
      </footer>
    </form>
  </div>
</template>

<script>
import ComponentCKEditor from './../../../forms/Ckeditor.vue'
import ComponentImageUpload from './../../../forms/ImageUpload.vue'

const slug = require('slug')

export default {
  components: {
    'forms-ckeditor': ComponentCKEditor,
    'forms-image-upload': ComponentImageUpload
  },
  props: {
    nonprofit: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      loaded: false,
      editSlug: false,

      // Form Data
      formData: {
        longDescription: '',
        shortDescription: '',
        slug: '',
        logo: null,
        logoFileId: 0
      },

      // Errors
      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    pageLink: function () {
      return this.$store.getters.setting('EVENT_URL') + '/nonprofits/'
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
    nonprofit: {
      handler: function () {
        const vue = this

        vue.formData = vue.sync(vue.formData, vue.nonprofit)
        if (parseInt(vue.formData.logoFileId) > 0) {
          vue.$request.get('files/' + vue.formData.logoFileId).then(function (response) {
            vue.formData.logo = response.data
          }).catch(function () {
            vue.formData.logo = null
          })
        } else {
          vue.formData.logo = null
        }
        vue.loaded = true
      },
      deep: true
    }
  },
  methods: {
    getConstraints: function () {
      return {
        longDescription: {
          presence: false
        },
        shortDescription: {
          presence: false,
          length: 200
        },
        slug: {
          presence: true
        },
        logo: {
          presence: false,
          image: true
        }
      }
    },
    submit: function (e) {
      e.preventDefault()
      const vue = this

      vue.addModal('spinner')

      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.clearModals()
      } else {
        vue.updateNonprofit()
      }
    },
    updateNonprofit: function () {
      const vue = this

      vue.getUpdatedNonprofitParams().then(function (updatedParams) {
        let promise = Promise.resolve()
        const originalLogoFileId = vue.nonprofit.logoFileId

        if (Object.keys(updatedParams).length) {
          promise = promise.then(function () {
            return vue.$request.patch('nonprofits/' + vue.nonprofit.id, updatedParams).then(function (response) {
              if (response.data.errorMessage) {
                console.log(response.data)
              }
              vue.editSlug = false
              vue.$emit('update-nonprofit', response.data[0])
            })
          })
        }

        if (updatedParams.hasOwnProperty('logoFileId') && !_.isEmpty(originalLogoFileId)) {
          promise = promise.then(function () {
            return vue.$request.delete('files/' + originalLogoFileId)
          })
        }

        promise.then(function () {
          vue.clearModals()
        })

        return promise
      }).catch(function (err) {
        vue.clearModals()
        vue.apiError = err.response.data.errors
      })
    },
    changeSlug: function (event) {
      event.preventDefault()
      const vue = this

      vue.editSlug = true
    },
    slugMask: function (event) {
      const vue = this
      vue.formData.slug = slug(event.target.value, { lower: true })
    },
    getUpdatedNonprofitParams: function () {
      const vue = this
      let promise = Promise.resolve()

      if (vue.formData.logo instanceof File) {
        promise = promise.then(function () {
          return vue.uploadFile('logo').then(function (uploadedFile) {
            vue.$store.commit('generateCacheKey')
            vue.formData.logoFileId = uploadedFile && uploadedFile.hasOwnProperty('id') ? uploadedFile.id : ''
          })
        })
      } else if (_.isPlainObject(vue.formData.logo) && vue.formData.logo.hasOwnProperty('id')) {
        vue.formData.logoFileId = vue.formData.logo.id
      } else {
        vue.formData.logoFileId = ''
      }

      promise = promise.then(function () {
        const params = vue.getUpdatedParameters(vue.formData, vue.nonprofit)
        delete params.logo
        return params
      })

      return promise
    },
    uploadFile: function (key) {
      const vue = this
      let file = null
      let promise = Promise.resolve()
      if (vue.formData[key]) {
        promise = promise.then(function () {
          return vue.$request.post('files', {
            content_type: vue.formData[key].type,
            filename: vue.formData[key].name
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
    }
  }
}
</script>
