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
            <h1>Donor Receipt</h1>
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
                      id="donorEmail"
                      v-model="formData.DONOR_EMAIL"
                      v-auto-focus
                      type="email"
                      name="donorEmail"
                      :class="{ 'has-error': formErrors.DONOR_EMAIL }"
                    >
                    <label for="donorEmail">Donor Email Address</label>
                  </div>
                  <div
                    v-if="formErrors.DONOR_EMAIL"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.DONOR_EMAIL }}
                  </div>
                  <div class="c-notes c-notes--below">
                    Enter the email address of the donor.
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  class="c-btn"
                  @click.prevent="view"
                >
                  View
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
import { mapActions } from 'vuex'

export default {
  props: {
    zIndex: {
      type: [Number, String],
      default: 1000
    }
  },
  data () {
    return {
      // Form Data
      formData: {
        DONOR_EMAIL: null
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
    ...mapActions([
      'setReceipt'
    ]),

    getConstraints () {
      return {
        DONOR_EMAIL: {
          label: 'Donor email address',
          presence: true,
          email: true
        }
      }
    },

    cancel () {
      this.clearModals()
    },

    view () {
      const vm = this

      vm.addModal('spinner')
      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      if (Object.keys(vm.formErrors).length) {
        vm.removeModal()
      } else {
        vm.generateReceipt()
      }
    },

    generateReceipt () {
      const vm = this

      vm.$request.get('donations/receipt', { email: vm.formData.DONOR_EMAIL }).then(function (response) {
        if (response.data.html) {
          vm.setReceipt({
            html: response.data.html,
            email: vm.formData.DONOR_EMAIL
          })

          vm.clearModals()
          vm.$router.push({ name: 'donations-receipt' })
        }

        if (response.data.errorMessage) {
          vm.formErrors = {}
          vm.formErrors.DONOR_EMAIL = 'Unable to generate a receipt for: ' + vm.formData.DONOR_EMAIL
          vm.removeModal('spinner')
        }
      }).catch(err => {
        vm.clearModals()
        console.log(err)
      })
    }
  }
}
</script>
