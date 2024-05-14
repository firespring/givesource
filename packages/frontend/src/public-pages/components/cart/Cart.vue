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
  <div>
    <layout-header />

    <layout-hero>
      <template #title>
        <h1>
          Your Donations
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <div class="wrapper wrapper--sm">
        <api-error v-model="apiError" />

        <form @submit.prevent="submit">
          <cart-donations
            v-model="formData.isFeeCovered"
            :display-total="!isCartEmpty"
            @has-error="donationHasErrors"
          />

          <fieldset v-if="!isCartEmpty">
            <legend>Your Contact & Billing Info</legend>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label>Your Name</label>
              </div>
              <div class="form-item__control">
                <div class="grid">
                  <div class="grid-item">
                    <label
                      for="donorNameFirst"
                      class="u-hidden-visually"
                    >First Name</label>
                    <input
                      id="donorNameFirst"
                      v-model="donor.firstName"
                      type="text"
                      name="donorNameFirst"
                      placeholder="First Name"
                      :class="{'has-error': formErrors.donor.firstName}"
                      required
                    >
                  </div>
                  <div class="grid-item">
                    <label
                      for="donorNameLast"
                      class="u-hidden-visually"
                    >Last Name</label>
                    <input
                      id="donorNameLast"
                      v-model="donor.lastName"
                      type="text"
                      name="donorNameLast"
                      placeholder="Last Name"
                      :class="{'has-error': formErrors.donor.lastName}"
                      required
                    >
                  </div>
                </div>
                <div
                  v-if="formErrors.donor.firstName || formErrors.donor.lastName"
                  class="notes notes--below notes--error"
                >
                  Enter your first name and last name
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="donorEmail">Your Email</label>
              </div>
              <div class="form-item__control">
                <input
                  id="donorEmail"
                  v-model="donor.email"
                  type="email"
                  name="donorEmail"
                  :class="{'has-error': formErrors.donor.email}"
                  required
                >
                <div
                  v-if="formErrors.donor.email"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.donor.email }}
                </div>
              </div>
            </div>

            <div class="form-item form-item--address form-item--required">
              <div class="form-item__label">
                <label>Your Billing Address</label>
              </div>
              <div class="form-item__control">
                <div class="address1">
                  <label
                    for="billingAddress1"
                    class="u-hidden-visually"
                  >Billing Address Line 1</label>
                  <input
                    id="billingAddress1"
                    v-model="donor.address1"
                    type="text"
                    name="billingAddress1"
                    placeholder="Address Line 1"
                    :class="{'has-error': formErrors.donor.address1}"
                    required
                  >
                  <div
                    v-if="formErrors.donor.address1"
                    class="notes notes--below notes--error"
                  >
                    {{ formErrors.donor.address1 }}
                  </div>
                </div>

                <div class="address2">
                  <label
                    for="billingAddress2"
                    class="u-hidden-visually"
                  >Billing Address Line 2</label>
                  <input
                    id="billingAddress2"
                    v-model="donor.address2"
                    type="text"
                    name="billingAddress2"
                    placeholder="Address Line 2"
                    :class="{'has-error': formErrors.donor.address2}"
                  >
                  <div
                    v-if="formErrors.donor.address2"
                    class="notes notes--below notes--error"
                  >
                    {{ formErrors.donor.address2 }}
                  </div>
                </div>

                <div class="city-state-zip">
                  <div class="city-state-zip__city">
                    <label
                      for="billingCity"
                      class="u-hidden-visually"
                    >Billing Address City</label>
                    <input
                      id="billingCity"
                      v-model="donor.city"
                      type="text"
                      name="billingCity"
                      placeholder="City"
                      :class="{'has-error': formErrors.donor.city}"
                      required
                    >
                  </div>
                  <div class="city-state-zip__state select-wrap">
                    <label
                      for="billingState"
                      class="u-hidden-visually"
                    >Billing Address State</label>
                    <forms-address-state
                      id="billingState"
                      v-model="donor.state"
                      name="billingState"
                      placeholder="State"
                      required
                    />
                  </div>
                  <div class="city-state-zip__zip">
                    <label
                      for="billingZip"
                      class="u-hidden-visually"
                    >Billing Address Zip</label>
                    <input
                      id="billingZip"
                      v-model="donor.zip"
                      type="text"
                      name="billingZip"
                      placeholder="ZIP"
                      :class="{'has-error': formErrors.donor.zip}"
                      required
                    >
                  </div>
                </div>
                <div
                  v-if="formErrors.donor.city || formErrors.donor.state || formErrors.donor.zip"
                  class="notes notes--below notes--error"
                >
                  Enter your city, state and zip code
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="billingPhone">Your Billing Phone</label>
              </div>
              <div class="form-item__control">
                <input
                  id="billingPhone"
                  v-model="donor.phone"
                  type="tel"
                  name="billingPhone"
                  :class="{'has-error': formErrors.donor.phone}"
                  required
                >
                <div
                  v-if="formErrors.donor.phone"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.donor.phone }}
                </div>
              </div>
            </div>

            <hr>

            <div class="form-item">
              <div class="form-item__label">
                Do you want your gift(s) to be anonymous?
              </div>
              <div class="form-item__control">
                <label class="checkbox-solo">
                  <input
                    id="coverDonationFees-1"
                    v-model="formData.isAnonymous"
                    type="checkbox"
                    name="coverDonationFees"
                  >
                  <span>Yes, make my gift(s) anonymous</span>
                </label>
                <div class="notes notes--below">
                  Your name and contact information will not be shared with the designated nonprofits.
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="!isCartEmpty">
            <legend>Your Payment Info</legend>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="cc_num">Credit Card #</label>
              </div>
              <div class="form-item__control">
                <forms-payment-cc-number
                  id="cc_num"
                  v-model="paymentDetails.ccNumber"
                  name="cc_num"
                  :has-error="formErrors.paymentDetails.hasOwnProperty('ccNumber')"
                />
                <div
                  v-if="formErrors.paymentDetails.ccNumber"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.paymentDetails.ccNumber }}
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="cc_name">Name on Card</label>
              </div>
              <div class="form-item__control">
                <input
                  id="cc_name"
                  v-model="paymentDetails.ccName"
                  type="text"
                  name="cc_name"
                  :class="{'has-error': formErrors.paymentDetails.hasOwnProperty('ccName')}"
                >
                <div
                  v-if="formErrors.paymentDetails.ccName"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.paymentDetails.ccName }}
                </div>
              </div>
            </div>

            <div class="form-item">
              <div class="grid">
                <div class="grid-item grid-item--collapse">
                  <div class="form-item form-item--required">
                    <div class="form-item__label">
                      <label>Expiration Date</label>
                    </div>
                    <div
                      class="form-item__control"
                      style="display: flex;"
                    >
                      <div
                        class="select-wrap"
                        style="margin: 0 .5rem 0 0;"
                      >
                        <label
                          for="cc_exp_month"
                          class="u-hidden-visually"
                        >Expiration Month</label>
                        <forms-payment-cc-month
                          id="cc_exp_month"
                          v-model="paymentDetails.ccExpMonth"
                          name="cc_exp_month"
                        />
                      </div>

                      <div class="select-wrap">
                        <label
                          for="cc_exp_year"
                          class="u-hidden-visually"
                        >Expiration Year</label>
                        <forms-payment-cc-year
                          id="cc_exp_year"
                          v-model="paymentDetails.ccExpYear"
                          name="cc_exp_year"
                          :years="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid-item">
                  <div class="form-item form-item--required">
                    <div class="form-item__label">
                      <label for="cc_csc">Security Code</label>
                    </div>
                    <div class="form-item__control">
                      <forms-payment-cc-security-code
                        id="cc_csc"
                        v-model="paymentDetails.ccCvv"
                        name="cc_csc"
                        :has-error="formErrors.paymentDetails.hasOwnProperty('ccCvv')"
                      />
                      <div
                        v-if="formErrors.paymentDetails.ccCvv"
                        class="notes notes--below notes--error"
                      >
                        {{ formErrors.paymentDetails.ccCvv }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <div
            style="margin: 0 0 1.5rem;"
            v-html="text"
          />

          <div
            v-if="!isCartEmpty"
            class="form-actions flex justify-center items-center"
          >
            <VueRecaptcha
              v-if="getSiteKey && !captchaVerified"
              :load-recaptcha-script="true"
              :sitekey="getSiteKey"
              @verify="validateRecaptcha"
            >
              <forms-submit
                :processing="processing"
                color="accent"
                size="lg"
              >
                Complete Your Donation
              </forms-submit>
            </VueRecaptcha>
            <forms-submit
              v-else
              :processing="processing"
              color="accent"
              size="lg"
            >
              Complete Your Donation
            </forms-submit>
          </div>
        </form>
      </div>
    </main>

    <layout-footer>
      <layout-sponsors />
    </layout-footer>
  </div>
</template>

<script>
import { VueRecaptcha } from 'vue-recaptcha'
import * as Settings from './../../helpers/settings'
import * as Utils from './../../helpers/utils'
import ComponentAddressState from './../forms/AddressState.vue'
import ComponentCartDonations from './CartDonations.vue'
import ComponentFooter from './../layout/Footer.vue'
import ComponentHeader from './../layout/Header.vue'
import ComponentHero from './../layout/Hero.vue'
import ComponentPaymentCCMonth from './../forms/PaymentCCMonth.vue'
import ComponentPaymentCCNumber from './../forms/PaymentCCNumber.vue'
import ComponentPaymentCCSecurityCode from './../forms/PaymentCCSecurityCode.vue'
import ComponentPaymentCCYear from './../forms/PaymentCCYear.vue'
import ComponentSponsors from './../layout/Sponsors.vue'
import ComponentSubmit from './../forms/Submit.vue'

export default {
  components: {
    'cart-donations': ComponentCartDonations,
    'forms-address-state': ComponentAddressState,
    'forms-payment-cc-month': ComponentPaymentCCMonth,
    'forms-payment-cc-number': ComponentPaymentCCNumber,
    'forms-payment-cc-security-code': ComponentPaymentCCSecurityCode,
    'forms-payment-cc-year': ComponentPaymentCCYear,
    'forms-submit': ComponentSubmit,
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-sponsors': ComponentSponsors,
    VueRecaptcha
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // refresh items
      vm.$store.getters.cartItems.forEach(async (item) => {
        const response = await axios.get(API_URL + 'nonprofits/' + item.nonprofit.id)
        if (response?.data?.status === 'ACTIVE') {
          // refresh nonprofit data in store
          vm.$store.commit('updateCartItemNonprofit', {
            nonprofit: response.data
          })
        } else {
          // nonprofit missing or inactive, remove cart item
          vm.$store.commit('removeCartItem', item.timestamp)
        }
      })

      axios.get(API_URL + 'contents' + Utils.generateQueryString({
        keys: 'CART_CHECKOUT_TEXT'
      })).then(response => {
        vm.contents = response.data
      }).catch(err => {
        vm.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate (to, from, next) {
    const vm = this

    axios.get(API_URL + 'contents' + Utils.generateQueryString({
      keys: 'CART_CHECKOUT_TEXT'
    })).then(response => {
      vm.contents = response.data
      next()
    }).catch(err => {
      vm.apiError = err.response.data.errors
      next()
    })
  },
  data () {
    return {
      captchaVerified: false,
      processing: false,
      donationError: false,

      settings: [],
      donations: [],
      contents: [],

      // Form Data
      formData: {
        isFeeCovered: true,
        isAnonymous: false
      },

      // Donor
      donor: {
        address1: '',
        address2: '',
        city: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        state: '',
        zip: ''
      },

      // Payment Details
      paymentDetails: {
        ccNumber: '',
        ccExpMonth: '',
        ccExpYear: '',
        ccName: '',
        ccCvv: ''
      },

      // Errors
      formErrors: {
        donor: {},
        formData: {},
        paymentDetails: {}
      },
      apiError: {}
    }
  },
  computed: {
    text () {
      const text = _.find(this.contents, { key: 'CART_CHECKOUT_TEXT' })
      return text ? text.value : null
    },
    eventTitle () {
      return Settings.eventTitle()
    },
    isCartEmpty () {
      return this.$store.state.cartItems.length === 0
    },
    /**
       * Check to see if recaptcha key exists
       *
       * @return {string|null|undefined}
       */
    getSiteKey () {
      return this.$store.getters.setting('RECAPTCHA_KEY')
    }
  },
  watch: {
    donor: {
      handler () {
        const vm = this
        if (Object.keys(vm.formErrors.donor).length) {
          vm.formErrors.donor = vm.validate(vm.donor, vm.getDonorConstraints())
        }
      },
      deep: true
    },
    formData: {
      handler () {
        const vm = this
        if (Object.keys(vm.formErrors.formData).length) {
          vm.formErrors.formData = vm.validate(vm.formData, vm.getFormDataConstraints())
        }
      },
      deep: true
    },
    paymentDetails: {
      handler () {
        const vm = this
        if (Object.keys(vm.formErrors.paymentDetails).length) {
          vm.formErrors.paymentDetails = vm.validate(vm.paymentDetails, vm.getPaymentDetailsConstraints())
        }
      },
      deep: true
    }
  },
  beforeMount () {
    const vm = this

    vm.setBodyClasses('page')
    vm.setPageTitle(vm.eventTitle + ' - Your Donations')
  },
  methods: {
    getDonorConstraints () {
      return {
        address1: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your address'
          }
        },
        address2: {
          presence: false
        },
        city: {
          presence: true
        },
        email: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your email'
          },
          email: {
            message: 'The email entered is not valid'
          }
        },
        firstName: {
          presence: true
        },
        lastName: {
          presence: true
        },
        phone: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your phone number'
          }
        },
        state: {
          presence: true
        },
        zip: {
          presence: true
        }
      }
    },
    getFormDataConstraints () {
      return {
        isFeeCovered: {
          presence: false
        },
        isAnonymous: {
          presence: false
        }
      }
    },
    getPaymentDetailsConstraints () {
      return {
        ccNumber: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your credit card number'
          },
          ccNumber: {
            message: 'The credit card number entered is not valid'
          }
        },
        ccExpMonth: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your card\'s expiration month'
          }
        },
        ccExpYear: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your card\'s expiration year'
          }
        },
        ccName: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter the name on your card'
          }
        },
        ccCvv: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your card\'s security code'
          },
          ccCvv: {
            message: 'The security code entered is not valid'
          }
        }
      }
    },
    submit () {
      const vm = this

      vm.processing = true
      vm.formErrors.donor = vm.validate(vm.donor, vm.getDonorConstraints())
      vm.formErrors.formData = vm.validate(vm.formData, vm.getFormDataConstraints())
      vm.formErrors.paymentDetails = vm.validate(vm.paymentDetails, vm.getPaymentDetailsConstraints())

      if (vm.donationError) {
        $('table.table-donations')[0].scrollIntoView(true)
        vm.processing = false
      } else if (Object.keys(vm.formErrors.donor).length || Object.keys(vm.formErrors.formData).length || Object.keys(vm.formErrors.paymentDetails).length) {
        vm.scrollToError()
        vm.processing = false
      } else {
        vm.processDonations()
      }
    },
    /**
       * Validate the form against recaptcha
       *
       * @param response
       * @return {Promise<AxiosResponse<any>>}
       */
    validateRecaptcha (response) {
      const vm = this
      return axios.post(API_URL + 'recaptcha/validate', {
        recaptchaToken: response
      }).then(response => {
        vm.captchaVerified = true
        vm.submit()
      }).catch(err => {
        vm.apiError = err.errorMessage ? err.errorMessage : 'Oops, something went wrong on our side.'
      })
    },
    processDonations () {
      const vm = this

      vm.getPaymentToken().then(response => {
        const payment = response.data
        const mode = _.find(vm.settings, { key: 'PAYMENT_SPRING_LIVE_MODE' }).value
        payment.is_test_mode = mode === '0'
        payment.cvv = vm.paymentDetails.ccCvv
        return axios.post(API_URL + 'donations/process', {
          donor: vm.donor,
          donations: vm.getDonations(),
          payment: payment
        })
      }).then(response => {
        vm.processing = false

        if (response.data && response.data.errorMessage) {
          console.log(response.data)
          vm.apiError = { message: response.data.errorMessage, type: response.data.errorType }
        } else {
          vm.$store.commit('clearCartItems')
          vm.$router.push({ name: 'cart-response' })
        }
      }).catch(err => {
        vm.apiError = err.response.data.errors
        vm.processing = false
      })
    },
    getDonations () {
      const vm = this

      vm.donations = []
      const cartItems = vm.$store.getters.cartItems
      cartItems.forEach(cartItem => {
        const fees = vm.calculateFees([cartItem])
        const total = vm.formData.isFeeCovered ? (cartItem.amount + fees) : cartItem.amount
        vm.donations.push({
          fees: fees,
          isAnonymous: vm.formData.isAnonymous,
          isFeeCovered: vm.formData.isFeeCovered,
          isOfflineDonation: false,
          nonprofitId: cartItem.nonprofit.id,
          subtotal: cartItem.amount,
          total: total,
          note: cartItem.note
        })
      })

      return vm.donations
    },
    getApiKey () {
      const vm = this

      const keys = [
        'PAYMENT_SPRING_PUBLIC_API_KEY',
        'PAYMENT_SPRING_TEST_PUBLIC_API_KEY',
        'PAYMENT_SPRING_LIVE_MODE'
      ]
      return axios.get(API_URL + 'settings' + Utils.generateQueryString({
        keys: keys
      })).then(response => {
        vm.settings = response.data

        const paymentMode = _.find(vm.settings, { key: 'PAYMENT_SPRING_LIVE_MODE' })
        const publicApiKey = _.find(vm.settings, { key: 'PAYMENT_SPRING_PUBLIC_API_KEY' })
        const testPublicApiKey = _.find(vm.settings, { key: 'PAYMENT_SPRING_TEST_PUBLIC_API_KEY' })

        if (paymentMode && paymentMode.value === '1' && publicApiKey.value) {
          return Promise.resolve(publicApiKey.value)
        }

        if (paymentMode && paymentMode.value === '0' && testPublicApiKey.value) {
          return Promise.resolve(testPublicApiKey.value)
        }

        return Promise.reject(new Error('There was an error processing your payment.'))
      }).catch(err => {
        vm.apiError = err.response.data.errors
      })
    },
    getPaymentToken () {
      const vm = this

      const params = {
        card_number: vm.paymentDetails.ccNumber.replace(/\s/g, ''),
        card_exp_month: vm.paymentDetails.ccExpMonth,
        card_exp_year: vm.paymentDetails.ccExpYear.toString(),
        card_owner_name: vm.paymentDetails.ccName,
        csc: vm.paymentDetails.ccCvv,
        token_type: 'credit_card',
        zip: vm.donor.zip
      }
      return vm.getApiKey().then(publicKey => {
        params.public_api_key = publicKey
        return axios.get('https://api.paymentspring.com/api/v1/tokens/jsonp' + Utils.generateQueryString(params))
      })
    },
    donationHasErrors (hasError) {
      this.donationError = hasError
    }
  }
}
</script>
