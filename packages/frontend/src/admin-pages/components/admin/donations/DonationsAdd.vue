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
      <div class="o-app_main-content o-app_main-content o-app_main-content--lg">
        <div class="o-app-main-content">

          <div class="o-page-header">
            <div class="o-page-header__text">
              <nav class="o-page-header-nav c-breadcrumb">
                <span><router-link :to="{ name: 'donations-list' }">Donations</router-link></span>
              </nav>
              <h1 class="o-page-header-title">Add Offline Single Donation</h1>
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
                  class="c-form-item c-form-item--text c-form-item--required"
                  :class="{ 'c-form-item--has-error': formErrors.firstName || formErrors.lastName }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="donorNameFirst"
                      class="c-form-item-label-text"
                    >Donor Name</label>
                  </div>
                  <div class="c-form-item__control">
                    <div class="c-form-control-grid">
                      <div class="c-form-control-grid__item">
                        <div
                          class="has-floating-label js-floating-label"
                          v-floating-label
                        >
                          <input
                            v-model="formData.firstName"
                            type="text"
                            name="donorNameFirst"
                            id="donorNameFirst"
                            :class="{ 'has-error': formErrors.firstName }"
                          >
                          <label for="donorNameFirst">First Name</label>
                        </div>
                        <div
                          v-if="formErrors.firstName"
                          class="c-notes c-notes--below c-notes--bad c-form-control-error"
                        >
                          {{ formErrors.firstName }}
                        </div>
                      </div>
                      <div class="c-form-control-grid__item">
                        <div
                          class="has-floating-label js-floating-label"
                          v-floating-label
                        >
                          <input
                            v-model="formData.lastName"
                            type="text"
                            name="donorNameLast"
                            id="donorNameLast"
                            :class="{ 'has-error': formErrors.lastName }"
                          >
                          <label for="donorNameLast">Last Name</label>
                        </div>
                        <div
                          v-if="formErrors.lastName"
                          class="c-notes c-notes--below c-notes--bad c-form-control-error"
                        >
                          {{ formErrors.lastName }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="c-form-item c-form-item--email"
                  :class="{ 'c-form-item--has-error': formErrors.email }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="donorEmail"
                      class="c-form-item-label-text"
                    >Donor Email</label>
                  </div>
                  <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--email">
                      <input
                        v-model="formData.email"
                        type="email"
                        name="donorEmail"
                        id="donorEmail"
                        :class="{ 'has-error': formErrors.email }"
                      >
                    </div>
                    <div
                      v-if="formErrors.email"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.email }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item">

                  <!-- BEGIN table -->
                  <table>
                    <thead>
                    <tr>
                      <th class="u-width-33p">Related Nonprofit (Required)</th>
                      <th class="u-width-33p">Donation Amount (Required)</th>
                      <th class="u-width-33p">Note (Optional)</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="data in donationRows">
                      <donations-options
                        :errors="formErrors"
                        :nonprofits="nonprofits"
                        :donation-data="data"
                        :nonprofit-field-name="constructNonprofitId(data.row)"
                        :dollar-amount-field-name="constructDonationAmount(data.row)"
                        :note-field-name="constructNote(data.row)"
                        @change="updateDonationDataRow"
                        @remove="removeDonationDataRow"
                      />
                    </template>
                    </tbody>
                  </table>
                  <div class="c-table-footer">
                    <div class="c-table-footer__actions">
                      <button
                        class="c-btn c-btn--icon c-btn--good c-btn--sm"
                        type="button"
                        @click="addDonationRowData"
                      >
                        <i
                          class="fa fa-plus-circle"
                          aria-hidden="true"
                        />Add Nonprofit
                      </button>
                    </div>
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
import ComponentDonationsOfflineNonprofitListRow from './DonationsOfflineNonprofitListRow.vue'

export default {

  data () {
    return {
      donationRows: [],
      donationRowTracker: 0,
      nonprofits: [],
      loaded: false,

      currencyOptions: {
        precision: 2,
        masked: true,
        thousands: ''
      },

      // Form Data
      formData: {
        email: '',
        firstName: '',
        lastName: ''
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

  created () {
    const vm = this
    vm.addDonationRowData()
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
     * Validate the normal form data
     *
     * @return {{firstName: {label: string, presence: boolean}, lastName: {label: string, presence: boolean}, email: {label: string, presence: boolean, email: boolean}}}
     */
    getConstraints () {
      return {
        email: {
          label: 'Donor email address',
          presence: false,
          email: true
        },
        firstName: {
          label: 'Donor first name',
          presence: true
        },
        lastName: {
          label: 'Donor last name',
          presence: true
        }
      }
    },

    /**
     *
     */
    submit (event) {
      console.log(event) // DM: DEBUG
      event.preventDefault()
    },

    /**
     * Submit and save form
     *
     * @param action
     */
    save (action) {
      const vm = this

      vm.addModal('spinner')

      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      vm.validateDonationRowData()
      if (Object.keys(vm.formErrors).length) {
        vm.clearModals()
      } else {
        vm.addDonation(action)
      }
    },

    /**
     * Validate the option rows
     */
    validateDonationRowData () {
      const vm = this
      _.each(vm.donationRows, function (donation) {
        if (parseInt(donation.selectedNonprofit) === 0 || donation.selectedNonprofit === '') {
          vm.formErrors[vm.constructNonprofitId(donation.row)] = 'This field is required.'
        }
        if (parseInt(donation.dollarAmount) === 0 || donation.dollarAmount === '') {
          vm.formErrors[vm.constructDonationAmount(donation.row)] = 'This field is required.'
        }
        if (parseFloat(donation.dollarAmount) < 0) {
          vm.formErrors[vm.constructDonationAmount(donation.row)] = 'This field must be greater than 0.'
        }
      })
    },

    /**
     * Add the donation create/find donor
     *
     * @param action
     */
    addDonation (action) {
      const vm = this
      let donations
      let promise = Promise.resolve()
      promise = promise.then(() => {
        const donor = {
          firstName: vm.formData.firstName,
          lastName: vm.formData.lastName
        }
        if (vm.formData.email) {
          donor.email = vm.formData.email
        }
        return vm.$request.post('donors', donor)
      }).then(response => {
        donations = _.map(vm.donationRows, function (donation) {
          return {
            isAnonymous: false,
            isFeeCovered: false,
            isOfflineDonation: true,
            subtotal: vm.getSubtotal(donation.dollarAmount),
            total: vm.getSubtotal(donation.dollarAmount),
            nonprofitId: parseInt(donation.selectedNonprofit),
            note: donation.note
          }
        })
        return vm.$request.post('donations/offline', { donorId: response.data.id, donations: donations })
      })

      promise.then(response => {
        vm.clearModals()

        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          if (action === 'add') {
            vm.formData = {
              email: '',
              firstName: '',
              lastName: ''
            }
            vm.donationRows = []
            vm.donationRowTracker = 0
            vm.addDonationRowData()
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
     * Get the subtotal
     */
    getSubtotal (subtotal) {
      return Math.floor(Math.round(subtotal * 100))
    },

    /**
     * add donation row
     */
    addDonationRowData (event) {
      console.log('hit?', event) // DM: DEBUG
      const vm = this
      vm.donationRows.push({
        selectedNonprofit: 0,
        dollarAmount: '',
        note: '',
        row: vm.donationRowTracker
      })
      vm.donationRowTracker++
    },

    /**
     * Update row
     *
     * @param data
     */
    updateDonationDataRow (data) {
      const vm = this
      let dataIndex = 0
      _.each(vm.donationRows, function (rowData, index) {
        if (rowData.row === data.row) {
          dataIndex = index
        }
      })
      vm.donationRows[dataIndex] = data
    },

    /**
     * Remove row
     *
     * @param data
     */
    removeDonationDataRow (data) {
      const vm = this
      vm.donationRows = _.filter(vm.donationRows, function (rowData) {
        return data.row !== rowData.row
      })
      vm.donationRowTracker = 0
      _.each(vm.donationRows, function (rowData) {
        rowData.row = vm.donationRowTracker
        vm.donationRowTracker++
      })
    },

    /**
     * get field name
     *
     * @param row
     * @return {string}
     */
    constructNonprofitId (row) {
      return 'donationOption.' + row + '.nonprofitId'
    },

    /**
     * get field name
     *
     * @param row
     * @return {string}
     */
    constructDonationAmount (row) {
      return 'donationOption.' + row + '.dollarAmount'
    },

    /**
     * get field name
     *
     * @param row
     * @return {string}
     */
    constructNote (row) {
      return 'donationOption.' + row + '.note'
    }
  },

  components: {
    'donations-options': ComponentDonationsOfflineNonprofitListRow,
    'forms-select-nonprofit': ComponentSelectNonprofit,
    'layout-spinner': ComponentSpinner,
    'state-select': ComponentSelectState
  }
}
</script>