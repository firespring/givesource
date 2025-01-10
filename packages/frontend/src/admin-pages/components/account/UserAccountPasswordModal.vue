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
    id="modal-account-edit-password"
    class="c-modal c-modal--sm"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <div class="c-modal-dialog">
        <div class="c-modal-dialog__contents">
          <div class="c-modal-header">
            <h1>Edit Your Password</h1>
          </div>

          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <div
                  v-if="errors.length"
                  class="c-alert c-alert--bad c-alert--shadow u-flex u-justify-center"
                >
                  <div class="c-alert__body u-flex u-justify-between">
                    <div class="c-alert__icon">
                      <i
                        class="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="c-alert__text">
                      <p v-for="error in errors">
                        {{ error }}
                      </p>
                    </div>
                  </div>
                </div>

                <fieldset
                  class="c-page-section__fieldset"
                  aria-labelledby="section-password"
                >
                  <legend>Password & Security</legend>
                  <div class="c-form-item c-form-item--password c-form-item--required">
                    <div class="c-form-item__control">
                      <div
                        v-floating-label
                        class="u-control-icon u-control-icon--password has-floating-label has-floating-label--blank js-floating-label"
                      >
                        <input
                          id="currentPassword"
                          v-model="formData.currentPassword"
                          v-auto-focus
                          type="password"
                          name="currentPassword"
                          :class="{ 'has-error': formErrors.currentPassword }"
                          aria-describedby="current-password-notes current-password-error"
                        >
                        <label for="currentPassword">Current Password</label>
                      </div>
                    </div>
                    <div
                      v-if="formErrors.currentPassword"
                      id="current-password-error"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                    >
                      {{ formErrors.currentPassword }}
                    </div>
                    <div
                      id="current-password-notes"
                      class="c-notes c-notes--below"
                    >
                      Please enter your current password.
                    </div>
                  </div>

                  <div class="c-form-item c-form-item--password c-form-item--required">
                    <div class="c-form-item__control">
                      <div
                        v-floating-label
                        class="u-control-icon u-control-icon--password has-floating-label has-floating-label--blank js-floating-label"
                      >
                        <input
                          id="password"
                          v-model="formData.password"
                          type="password"
                          name="password"
                          :class="{ 'has-error': formErrors.password }"
                          aria-describedby="new-password-notes new-password-error"
                        >
                        <label for="password">New Password</label>
                      </div>
                      <div
                        v-if="formErrors.password"
                        id="new-password-error"
                        class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                      >
                        {{ formErrors.password }}
                      </div>
                      <div
                        id="new-password-notes"
                        class="c-notes c-notes--below"
                      >
                        Your password must be at least 8 characters long and contain a combination of numbers and upper and lower case letters.
                      </div>
                    </div>
                  </div>

                  <div class="c-form-item c-form-item--password c-form-item--required">
                    <div class="c-form-item__control">
                      <div
                        v-floating-label
                        class="u-control-icon u-control-icon--password has-floating-label has-floating-label--blank js-floating-label"
                      >
                        <input
                          id="passwordConfirm"
                          v-model="formData.passwordConfirm"
                          type="password"
                          name="passwordConfirm"
                          :class="{ 'has-error': formErrors.passwordConfirm }"
                          aria-describedby="confirm-password-error"
                        >
                        <label for="passwordConfirm">Confirm Password</label>
                      </div>
                      <div
                        v-if="formErrors.passwordConfirm"
                        id="confirm-password-error"
                        class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                      >
                        {{ formErrors.passwordConfirm }}
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
import * as User from '../../helpers/user'

export default {
  props: {
    zIndex: {
      type: [Number, String],
      default: 1000
    }
  },
  data: function () {
    return {

      // Form Data
      formData: {
        currentPassword: '',
        password: '',
        passwordConfirm: ''
      },

      // Errors
      errors: [],
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
    }
  },
  methods: {
    getConstraints: function () {
      return {
        currentPassword: {
          presence: true
        },
        password: {
          presence: true
        },
        passwordConfirm: {
          label: 'Password confirmation',
          presence: true,
          equality: 'password'
        }
      }
    },
    cancel: function () {
      this.clearModals()
    },
    save: function () {
      const vue = this

      vue.addModal('spinner')
      vue.errors = []
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.removeModal()
      } else {
        vue.changeUserPassword()
      }
    },
    changeUserPassword: function () {
      const vue = this

      User.changePassword(vue.formData.currentPassword, vue.formData.password, function (err) {
        vue.removeModal()
        if (err) {
          vue.errors.push(User.formatCognitoErrorMessage(err))
        } else {
          vue.clearModals()
        }
      })
    }
  }
}
</script>
