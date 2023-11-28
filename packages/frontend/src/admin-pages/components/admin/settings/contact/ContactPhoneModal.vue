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
    id="modal-settings-edit-contact-phone-number"
    class="c-modal c-modal--sm"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <div class="c-modal-dialog">
        <div class="c-modal-dialog__contents">
          <div class="c-modal-header">
            <h1>Edit Contact Phone Number</h1>
          </div>

          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <api-error v-model="apiError" />
                <fieldset
                  class="c-page-section__fieldset"
                  aria-labelledby="section-contact-phone"
                >
                  <div
                    class="c-form-item c-form-item--email c-form-item--required"
                    :class="{ 'c-form-item--has-error': formErrors.CONTACT_PHONE }"
                  >
                    <div class="c-form-item__control">
                      <div
                        v-floating-label
                        class="u-control-icon u-control-icon--tel has-floating-label has-floating-label--blank js-floating-label"
                      >
                        <input
                          id="contactPhone"
                          v-model="formData.CONTACT_PHONE"
                          v-auto-focus
                          type="tel"
                          name="contactPhone"
                          :class="{ 'has-error': formErrors.CONTACT_PHONE }"
                        >
                        <label for="contactPhone">Contact Phone #</label>
                      </div>
                      <div
                        v-if="formErrors.CONTACT_PHONE"
                        class="c-notes c-notes--below c-notes--bad c-form-control-error"
                      >
                        {{ formErrors.CONTACT_PHONE }}
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  class="c-btn"
                  @click="save"
                >
                  Save &amp; Close
                </button>
                <button
                  class="c-btn c-btn--neutral c-btn--text"
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
export default {
  props: {
    zIndex: {
      type: [Number, String],
      default: 1000
    },
    data: {
      type: Object,
      default: () => ({
        CONTACT_PHONE: null
      })
    }
  },
  data: function () {
    return {
      // Form Data
      formData: {
        CONTACT_PHONE: this.data.CONTACT_PHONE
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
        CONTACT_PHONE: {
          label: 'Contact phone number',
          presence: true
        }
      }
    },
    cancel: function () {
      this.clearModals()
    },
    save: function () {
      const vue = this

      vue.addModal('spinner')
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.removeModal()
      } else {
        vue.updateSetting()
      }
    },
    updateSetting: function () {
      const vue = this

      const params = vue.getUpdatedParameters(vue.formData, vue.data)
      if (Object.keys(params).length === 0) {
        vue.clearModals()
        return
      }

      vue.$request.patch('settings', {
        settings: [
          {
            key: 'CONTACT_PHONE',
            value: vue.formData.CONTACT_PHONE
          }
        ]
      }).then(function (response) {
        vue.clearModals()
        if (response.data.errorMessage) {
          console.log(response.data)
        }
        vue.bus.$emit('updateSetting', {
          key: 'CONTACT_PHONE',
          value: vue.formData.CONTACT_PHONE
        })
      }).catch(function (err) {
        vue.removeModal('spinner')
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
