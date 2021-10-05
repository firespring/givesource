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
    <navigation></navigation>
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content o-app_main-content--md">
        <div class="o-app-main-content">
          <div class="o-page-header">
            <div class="o-page-header__text">
              <nav class="o-page-header-nav c-breadcrumb">
                <span><router-link :to="{ name: 'donations-list' }">Donations</router-link></span>
              </nav>
              <h1 class="o-page-header-title">Add Offline Bulk Donation</h1>
            </div>
          </div>
          <api-error v-model="apiError"></api-error>
          <form v-on:submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
              <layout-spinner
                v-if="!loaded"
                height="496px"
              ></layout-spinner>
              <div
                class="c-page-section__main"
                v-else
              >
                <div
                  class="c-form-item c-form-item--select c-form-item--combobox c-form-item--required"
                  :class="{ 'c-form-item--has-error': formErrors.nonprofitId }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="nonprofitId"
                      class="c-form-item-label-text"
                    >Related Nonprofit</label>
                  </div>
                  <div class="c-form-item__control">
                    <forms-select-nonprofit
                      v-model="formData.nonprofitId"
                      id="nonprofitId"
                      name="nonprofitId"
                      :nonprofits="nonprofits"
                      :hasError="formErrors.hasOwnProperty('nonprofitId')"
                    ></forms-select-nonprofit>
                    <div
                      v-if="formErrors.nonprofitId"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.nonprofitId }}
                    </div>
                  </div>
                </div>

                <div
                  class="c-form-item c-form-item--number c-form-item--required"
                  :class="{ 'c-form-item--has-error': formErrors.subtotal }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="donationAmount"
                      class="c-form-item-label-text"
                    >Total Donation Amount</label>
                  </div>
                  <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--dollar">
                      <input
                        v-model="formData.subtotal"
                        type="text"
                        name="donationAmount"
                        id="donationAmount"
                        style="width: 10rem;"
                        :class="{ 'has-error': formErrors.subtotal }"
                        v-money="currencyOptions"
                      >
                    </div>
                    <div
                      v-if="formErrors.subtotal"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.subtotal }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--radio">
                  <div class="c-form-item__control">
                    <div
                      class="c-form-item c-form-item--number c-form-item--required"
                      :class="{ 'c-form-item--has-error': formErrors.count}"
                    >
                      <div class="c-form-item__label">
                        <label
                          for="donationNum"
                          class="c-form-item-label-text"
                        ># of Donations</label>
                      </div>
                      <div class="c-form-item__control">
                        <input
                          v-model="formData.count"
                          type="number"
                          name="donationNum"
                          id="donationNum"
                          :class="{ 'has-error': formErrors.count }"
                        >
                      </div>
                      <div
                        v-if="formErrors.count"
                        class="c-notes c-notes--below c-notes--bad c-form-control-error"
                      >
                        {{ formErrors.count }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="c-form-item c-form-item--text"
                  :class="{ 'c-form-item--has-error': formErrors.note}"
                >
                  <div class="c-form-item__label">
                    <label
                      for="donationNote"
                      class="c-form-item-label-text"
                    >Note</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      v-model="formData.note"
                      type="text"
                      name="donationNote"
                      id="donationNote"
                      :class="{ 'has-error': formErrors.note }"
                    >
                  </div>
                  <div
                    v-if="formErrors.note"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.note }}
                  </div>
                </div>
              </div>
            </section>

            <footer class="c-form-actions">
              <button
                v-on:click="save('close')"
                type="submit"
                class="c-btn"
              >Save & Finish
              </button>
              <button
                v-on:click="save('add')"
                type="submit"
                class="c-btn"
              >Save & Add Another
              </button>
              <router-link
                :to="{ name: 'donations-list' }"
                class="c-btn c-btn--text c-btn--neutral"
              >Cancel
              </router-link>
            </footer>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ComponentSelectNonprofit from './../../forms/SelectNonprofit.vue'
import ComponentSpinner from './../../layout/Spinner.vue'
import ComponentSelectState from './../../forms/SelectState.vue'

export default {

  data () {
    return {
      nonprofits: [],
      loaded: false,

      currencyOptions: {
        precision: 2,
        masked: true,
        thousands: ''
      },

      // Form Data
      formData: {
        count: '',
        nonprofitId: '',
        subtotal: 0,
        type: 'BULK'
      },

      // Errors
      formErrors: {},
      apiError: {}
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$request.get('nonprofits/search', {
        status: 'ACTIVE'
      }).then(response => {
        vm.nonprofits = response.data
        vm.loaded = true
      })
    })
  },

  beforeRouteUpdate (to, from, next) {
    const vm = this
    vm.$request.get('nonprofits/search', {
      status: 'ACTIVE'
    }).then(response => {
      vm.nonprofits = response.data
      vm.loaded = true
      next()
    }).catch(() => {
      next()
    })
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
    /**
     * validate the form
     */
    getConstraints () {
      const vm = this
      const nonprofitIds = _.map(vm.nonprofits, function (nonprofit) {
        return nonprofit.id.toString()
      })

      return {
        nonprofitId: {
          label: 'Related nonprofit',
          presence: true,
          inclusion: {
            within: nonprofitIds,
            message: 'you selected does not exist'
          }
        },
        subtotal: {
          label: 'Donation amount',
          presence: true,
          numericality: {
            greaterThan: 0
          }
        },
        count: {
          label: 'Number of donations',
          presence: true,
          numericality: {
            greaterThan: 0
          }
        },
        note: {
          label: 'Note on donations',
          presence: false
        }
      }
    },

    /**
     * stop the form from doing anything
     */
    submit (event) {
      event.preventDefault()
    },

    /**
     * Validate and save the form/throw error
     */
    save (action) {
      const vm = this
      vm.addModal('spinner')
      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      if (Object.keys(vm.formErrors).length) {
        vm.clearModals()
      } else {
        vm.addDonation(action)
      }
    },

    /**
     * Add donation and reset form or send back to list view
     */
    addDonation (action) {
      const vm = this
      const donation = {
        isAnonymous: false,
        isFeeCovered: false,
        isOfflineDonation: true,
        subtotal: vm.getSubtotal(),
        total: vm.getSubtotal(),
        type: vm.formData.type,
        count: vm.formData.count,
        note: vm.formData.note,
      }
      let promise = Promise.resolve()
      promise = promise.then(() => {
        return vm.$request.post('nonprofits/' + vm.formData.nonprofitId + '/donations', donation)
      })
      promise.then(response => {
        vm.clearModals()
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          if (action === 'add') {
            vm.resetForm()
          } else {
            vm.$router.push({ name: 'donations-list' })
          }
        }
      }).catch(err => {
        vm.clearModals()
        vm.apiError = err.response.data.errors
      })
    },

    /**
     * Maths the number out
     *
     * @return {number}
     */
    getSubtotal () {
      return Math.floor(Math.round(this.formData.subtotal * 100))
    },

    /**
     * Reset the form data
     */
    resetForm () {
      const vm = this
      Object.keys(vm.formData).forEach(function (key, index) {
        vm.formData[key] = typeof vm.formData[key] === 'string' ? '' : 0
      })
    }
  },

  components: {
    'forms-select-nonprofit': ComponentSelectNonprofit,
    'layout-spinner': ComponentSpinner,
    'state-select': ComponentSelectState
  }
}
</script>