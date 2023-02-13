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
    id="modal-donations-generate-receipt"
    class="c-modal c-modal--sm"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <div class="c-modal-dialog">
        <div class="c-modal-dialog__contents">
          <div class="c-modal-header">
            <h1>Email Receipt</h1>
          </div>

          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <api-error v-model="apiError" />
                <fieldset
                  class="c-page-section__fieldset"
                  aria-labelledby="section-donor-email"
                >
                  <div
                    v-floating-label
                    class="u-control-icon u-control-icon--email has-floating-label has-floating-label--blank js-floating-label"
                  >
                    <input
                      id="toEmail"
                      v-model="formData.TO_EMAIL"
                      v-auto-focus
                      type="email"
                      name="toEmail"
                      :class="{ 'has-error': formErrors.TO_EMAIL }"
                    >
                    <label for="toEmail">Send To Email Address</label>
                  </div>
                  <div
                    v-if="formErrors.TO_EMAIL"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.TO_EMAIL }}
                  </div>
                  <div class="c-notes c-notes--below">
                    Enter the email address to send this receipt to.
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  class="c-btn"
                  @click.prevent="send"
                >
                  Send
                </button>
                <button
                  class="c-btn c-btn--neutral c-btn--text"
                  @click.prevent="cancel"
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
      default: {
        email: ''
      }
    }
  },
  data () {
    return {
      // Form Data
      formData: {
        TO_EMAIL: this.data.email
      },

      // Errors
      formErrors: {},
      apiError: {}
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
    }
  },

  methods: {
    getConstraints () {
      return {
        TO_EMAIL: {
          label: 'To email address',
          presence: true,
          email: true
        }
      }
    },

    cancel () {
      this.clearModals()
    },

    send () {
      const vm = this

      vm.addModal('spinner')
      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      if (Object.keys(vm.formErrors).length) {
        vm.removeModal()
      } else {
        vm.sendDonorReceiptEmail()
      }
    },

    sendDonorReceiptEmail () {
      const vm = this

      vm.$request.post('donations/receipt/admin', { toAddress: vm.formData.TO_EMAIL, email: vm.data.email }).then(() => {
        vm.clearModals()
      }).catch(err => {
        vm.clearModals()
        vm.apiError = err.response.data.errors
      })
    }
  }
}
</script>
