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
  <div
    id="modal-faq-add"
    class="c-modal c-modal--warning"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <div class="c-modal-dialog">
        <div class="c-modal-dialog__contents">
          <div class="c-modal-header">
            <h1>Edit Toolkit Resource</h1>
          </div>

          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <api-error v-model="apiError" />

                <div class="c-form-item c-form-item--text c-form-item--required">
                  <div class="c-form-item__label">
                    <label
                      for="resourceTitle"
                      class="c-form-item-label-text"
                    >Resource Title</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      id="resourceTitle"
                      v-model="formData.TOOLKIT_RESOURCE_LIST_ITEM_TITLE.value"
                      v-auto-focus
                      type="text"
                      name="resourceTitle"
                      :class="{'has-error': formErrors['TOOLKIT_RESOURCE_LIST_ITEM_TITLE.value']}"
                    >
                    <div
                      v-if="formErrors['TOOLKIT_RESOURCE_LIST_ITEM_TITLE.value']"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors['TOOLKIT_RESOURCE_LIST_ITEM_TITLE.value'] }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--text">
                  <div class="c-form-item__label">
                    <label
                      for="resourceDescription"
                      class="c-form-item-label-text"
                    >Resource Description</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      id="resourceDescription"
                      v-model="formData.TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION.value"
                      type="text"
                      name="resourceDescription"
                      :class="{'has-error': formErrors['TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION.value']}"
                    >
                    <div
                      v-if="formErrors['TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION.value']"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors['TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION.value'] }}
                    </div>
                    <div class="c-notes c-notes--below">
                      Provide some additional information about this resource.
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--radio">
                  <div class="c-form-item__label">
                    <div
                      id="toolkitResourceType"
                      class="c-form-item-label-text"
                    >
                      Resource Type
                    </div>
                  </div>
                  <div class="c-form-item__control">
                    <ul
                      class="c-input-list c-input-list--radio c-input-list--inline has-sub-options--show"
                      aria-labelledby="toolkitResourceType"
                    >
                      <li
                        class="has-sub-options"
                        :class="{'has-sub-options--show': showFileInput}"
                      >
                        <input
                          id="toolkitResourceType-1"
                          v-model="formData.TOOLKIT_RESOURCE_LIST_ITEM_TYPE.value"
                          type="radio"
                          name="toolkitResourceType"
                          value="FILE"
                          rel="toolkitResourceType-1-sub-options"
                        >
                        <label for="toolkitResourceType-1">Downloadable File</label>
                      </li>
                      <li
                        class="has-sub-options"
                        :class="{'has-sub-options--show': showLinkInput}"
                      >
                        <input
                          id="toolkitResourceType-2"
                          v-model="formData.TOOLKIT_RESOURCE_LIST_ITEM_TYPE.value"
                          type="radio"
                          name="toolkitResourceType"
                          value="LINK"
                          rel="toolkitResourceType-2-sub-options"
                        >
                        <label for="toolkitResourceType-2">Link</label>
                      </li>
                    </ul>

                    <div class="sub-options-inline-wrapper sub-options-inline-wrapper--show">
                      <div
                        id="toolkitResourceType-1-sub-options"
                        class="sub-options-inline"
                        :class="{'sub-options-inline--show': showFileInput}"
                      >
                        <div
                          v-if="loading"
                          class="c-form-item"
                        >
                          <layout-spinner height="80px" />
                        </div>

                        <div
                          v-else
                          class="c-form-item c-form-item--file c-form-item--file-picker c-form-item--required"
                        >
                          <div class="c-form-item__label">
                            <label
                              for="resourceFile"
                              class="c-form-item-label-text"
                            >File</label>
                          </div>
                          <forms-file-upload
                            v-model="formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value"
                            :placeholder="filename"
                          />
                          <div
                            v-if="formErrors['TOOLKIT_RESOURCE_LIST_ITEM_FILE.value']"
                            class="c-notes c-notes--below c-notes--bad c-form-control-error"
                          >
                            {{ formErrors['TOOLKIT_RESOURCE_LIST_ITEM_FILE.value'] }}
                          </div>
                        </div>
                      </div>

                      <div
                        id="toolkitResourceType-2-sub-options"
                        class="sub-options-inline"
                        :class="{'sub-options-inline--show': showLinkInput}"
                      >
                        <div class="c-form-item c-form-item--sm c-form-item--text c-form-item--required">
                          <div class="c-form-item__label">
                            <label
                              for="toolkitResourceType-2-url"
                              class="c-form-item-label-text"
                            >URL</label>
                          </div>
                          <div class="c-form-item__control">
                            <div class="u-control-icon u-control-icon--url">
                              <input
                                id="toolkitResourceType-2-url"
                                v-model="formData.TOOLKIT_RESOURCE_LIST_ITEM_LINK.value"
                                type="text"
                                name="toolkitResourceType-2-url"
                                placeholder="https://"
                                :class="{'has-error': formErrors['TOOLKIT_RESOURCE_LIST_ITEM_LINK.value']}"
                              >
                            </div>
                            <div
                              v-if="formErrors['TOOLKIT_RESOURCE_LIST_ITEM_LINK.value']"
                              class="c-notes c-notes--below c-notes--bad c-form-control-error"
                            >
                              {{ formErrors['TOOLKIT_RESOURCE_LIST_ITEM_LINK.value'] }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  type="button"
                  class="c-btn js-modal-close"
                  @click="save"
                >
                  Save &amp; Close
                </button>
                <button
                  type="button"
                  class="c-btn c-btn--neutral c-btn--text js-modal-close"
                  @click="cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentFileUpload from './../../../forms/FileUpload.vue'
import ComponentSpinner from './../../../layout/Spinner.vue'

export default {
  components: {
    'forms-file-upload': ComponentFileUpload,
    'layout-spinner': ComponentSpinner
  },
  props: {
    zIndex: {
      type: [Number, String],
      default: 1000
    },
    data: {
      type: Object,
      default: () => ({
        content: {}
      })
    }
  },
  data: function () {
    return {
      original: [],
      file: {},
      loading: false,

      // Form Data
      formData: {
        TOOLKIT_RESOURCE_LIST_ITEM_TITLE: {
          key: 'TOOLKIT_RESOURCE_LIST_ITEM_TITLE',
          type: 'TEXT',
          value: '',
          id: 0
        },
        TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION: {
          key: 'TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION',
          type: 'TEXT',
          value: '',
          id: 0
        },
        TOOLKIT_RESOURCE_LIST_ITEM_TYPE: {
          key: 'TOOLKIT_RESOURCE_LIST_ITEM_TYPE',
          type: 'OPTION',
          value: 'FILE',
          id: 0
        },
        TOOLKIT_RESOURCE_LIST_ITEM_FILE: {
          key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE',
          type: 'FILE',
          value: '',
          id: 0
        },
        TOOLKIT_RESOURCE_LIST_ITEM_LINK: {
          key: 'TOOLKIT_RESOURCE_LIST_ITEM_LINK',
          type: 'LINK',
          value: '',
          id: 0
        }
      },

      // Errors
      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    showFileInput: function () {
      return this.formData.TOOLKIT_RESOURCE_LIST_ITEM_TYPE.value === 'FILE'
    },
    showLinkInput: function () {
      return this.formData.TOOLKIT_RESOURCE_LIST_ITEM_TYPE.value === 'LINK'
    },
    filename: function () {
      return Object.keys(this.file).length ? this.file.filename : ''
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
    data: {
      handler: function () {
        const vue = this
        if (Object.keys(vue.data.content).length) {
          Object.keys(vue.formData).forEach(function (key) {
            const content = _.find(vue.data.content.value, { key: key })
            if (content) {
              vue.formData[key] = content
            }
          })
        }
      },
      deep: true
    }
  },
  mounted: function () {
    const vue = this
    if (Object.keys(vue.data.content).length) {
      vue.original = JSON.parse(JSON.stringify(vue.data.content.value))
      Object.keys(vue.formData).forEach(function (key) {
        const content = _.find(vue.data.content.value, { key: key })
        if (content) {
          vue.formData[key] = content
        }
      })

      const file = _.find(vue.data.content.value, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE' })
      if (file) {
        vue.loading = true
        vue.$request.get('files/' + file.value).then(function (response) {
          vue.file = response.data
          vue.loading = false
        })
      }
    }
  },
  methods: {
    getConstraints: function () {
      const vue = this

      const constraints = {
        'TOOLKIT_RESOURCE_LIST_ITEM_TITLE.value': {
          label: 'Resource title',
          presence: true
        },
        'TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION.value': {
          label: 'Resource description',
          presence: false
        },
        'TOOLKIT_RESOURCE_LIST_ITEM_TYPE.value': {
          label: 'Resource type',
          presence: true,
          inclusion: ['FILE', 'LINK']
        }
      }

      if (vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_TYPE.value === 'LINK') {
        constraints['TOOLKIT_RESOURCE_LIST_ITEM_LINK.value'] = {
          label: 'Link',
          presence: true,
          url: true
        }
      } else {
        constraints['TOOLKIT_RESOURCE_LIST_ITEM_FILE.value'] = {
          label: 'File',
          presence: true
        }
      }

      return constraints
    },
    cancel: function () {
      // this doesn't appear needed, but if it is we need to do it without mutating the prop
      // this.data.content.value = this.original
      this.clearModals()
    },
    save: function () {
      const vue = this

      vue.addModal('spinner')
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.removeModal()
      } else {
        vue.updateContents()
      }
    },
    updateContents: function () {
      const vue = this

      const changed = _.differenceWith(vue.data.content.value, vue.original, _.isEqual)
      const toUpdate = _.reject(changed, { value: '' })
      const toDelete = _.filter(changed, { value: '' })

      let file = null
      let promise = Promise.resolve()
      if (_.find(toUpdate, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE' })) {
        const originalFileContent = _.find(vue.original, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE' })
        if (originalFileContent) {
          promise = promise.then(function () {
            vue.$request.delete('files/' + originalFileContent.value)
          })
        }

        promise = promise.then(function () {
          return vue.$request.post('files', {
            content_type: vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value.type,
            filename: vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value.name
          })
        }).then(function (response) {
          file = response.data.file
          const signedUrl = response.data.upload_url

          const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers))
          const instance = axios.create()
          instance.defaults.headers.common['Content-Type'] = vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value.type || 'application/octet-stream'
          instance.defaults.headers.put['Content-Type'] = vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value.type || 'application/octet-stream'
          instance.defaults.headers.put['Content-Disposition'] = 'attachment; filename="' + vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value.name + '"'
          axios.defaults.headers = defaultHeaders
          return instance.put(signedUrl, vue.formData.TOOLKIT_RESOURCE_LIST_ITEM_FILE.value)
        }).then(function () {
          toUpdate.forEach(function (content) {
            if (content.key === 'TOOLKIT_RESOURCE_LIST_ITEM_FILE') {
              content.value = file.id
            }
          })
        })
      }

      if (toUpdate.length) {
        promise = promise.then(function () {
          return vue.$request.patch('contents', {
            contents: toUpdate
          })
        })
      }

      if (toDelete.length) {
        promise = promise.then(function () {
          return vue.$request.delete('contents', {
            contents: toDelete
          })
        })
      }

      promise.then(function () {
        vue.$store.commit('generateCacheKey')
        vue.bus.$emit('updateToolkitResourceList', vue.data.content)
        vue.clearModals()
      }).catch(function (err) {
        vue.removeModal('spinner')
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
