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
    class="donation-overlay"
    :style="{ 'z-index': zIndex }"
    :class="{'donation-overlay--has-tiers': displayDonationTiers}"
  >
    <div
      v-if="loaded"
      class="donation-overlay__wrapper"
    >
      <div
        ref="donationModalOptions"
        class="donation-modal donation-modal--options"
      >
        <section
          v-if="displayDonationTiers"
          class="donation-modal__header"
          role="region"
          aria-label="Pick a Donation Amount"
        >
          <h1 class="donation-modal__title">
            Pick a Donation Amount
          </h1>
        </section>

        <section
          v-else
          class="donation-modal__header"
          role="region"
          aria-label="Enter a Donation Amount"
        >
          <h1 class="donation-modal__title">
            Enter a Donation Amount
          </h1>
        </section>

        <div class="donation-modal__content">
          <div
            v-if="displayDonationTiers"
            class="donation-options"
          >
            <donation-tiers-option-row
              v-for="donationTier in donationTiers"
              :key="donationTier.uuid"
              :donation-tier="donationTier"
              @select-tier="selectTier"
            />
          </div>

          <div class="donation-options-custom">
            <h2 v-if="displayDonationTiers">
              Or Enter a Custom Amount
            </h2>
            <form @submit="customAmount">
              <div class="input">
                <label
                  for="customAmount"
                  class="u-hidden-visually"
                >Donation Amount</label>
                <forms-money
                  id="customAmount"
                  v-model="formData.customAmount"
                  name="customAmount"
                  placeholder="Enter Amount"
                  aria-describedby="donation-amount-error"
                  :has-error="formErrors.hasOwnProperty('customAmount')"
                />
              </div>
              <div class="action">
                <button class="btn">
                  <span class="u-hidden-visually">Add to cart</span>
                  <i
                    class="fas fa-arrow-right"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </form>
            <div
              id="donation-amount-error"
              aria-live="polite"
            >
              <div
                v-if="formErrors.customAmount"
                class="notes notes--below notes--error"
              >
                A custom donation amount must be at least $10.00
              </div>
            </div>
          </div>
        </div>

        <a
          href="#"
          class="donation-close"
          role="button"
          @click="close"
        ><span class="u-hidden-visually">Close</span><i
          class="fas fa-times-circle"
          aria-hidden="true"
        /></a>
      </div>
    </div>

    <div
      v-else
      class="donation-overlay__wrapper"
    >
      <layout-spinner />
    </div>
  </div>
</template>

<script>
import ComponentDonationTiersModalOptionRow from './DonationTiersModalOptionRow.vue'
import ComponentMoney from './../../forms/Money.vue'
import ComponentSpinner from './../../layout/Spinner.vue'
import { useAppStore } from '../../../store'

export default {
  components: {
    'donation-tiers-option-row': ComponentDonationTiersModalOptionRow,
    'forms-money': ComponentMoney,
    'layout-spinner': ComponentSpinner
  },
  props: {
    data: {
      type: Object,
      default: () => ({ nonprofit: null })
    },
    zIndex: {
      type: [Number, String],
      default: 1000
    }
  },
  data: function () {
    return {
      donationTiers: [],
      nonprofit: null,
      loaded: false,

      // Form Data
      formData: {
        customAmount: ''
      },
      formErrors: {},

      currencyOptions: {
        precision: 2,
        masked: true,
        thousands: ''
      }
    }
  },
  computed: {
    displayDonationTiers: function () {
      return this.donationTiers.length
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
    loaded: {
      handler (value) {
        const vue = this
        if (!value) return

        vue.$nextTick(() => {
          $(vue.$el).find('input, textarea, select').eq(0).focus()
        })
      }
    }

  },
  beforeCreate () {
    this.$store = useAppStore()
  },
  created: function () {
    const vue = this

    vue.addBodyClasses('has-donation-overlay')
    vue.nonprofit = vue.data.nonprofit
    axios.get(API_URL + 'nonprofits/' + vue.nonprofit.id + '/tiers').then(function (response) {
      response.data.sort(function (a, b) {
        return b.amount - a.amount
      })
      vue.donationTiers = response.data
      vue.loaded = true
    })
  },
  methods: {
    getConstraints: function () {
      return {
        customAmount: {
          presence: true,
          numericality: {
            greaterThanOrEqualTo: 10
          }
        }
      }
    },
    close: function (event) {
      event.preventDefault()
      const vue = this

      vue.removeModal('donation-tiers')
      vue.removeBodyClasses('has-donation-overlay')
    },
    selectTier: function (amount) {
      const vue = this

      vue.$store.commit('addCartItem', {
        amount: amount,
        nonprofit: vue.nonprofit
      })

      $(vue.$refs.donationModalOptions).fadeOut(function () {
        vue.removeModal('donation-tiers')
        vue.removeBodyClasses('has-donation-overlay')
        vue.addModal('donation-cart')
      })
    },
    customAmount: function (event) {
      event.preventDefault()
      const vue = this

      const amount = Math.round(parseFloat(vue.formData.customAmount) * 100)
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())

      if (amount && !Object.keys(vue.formErrors).length) {
        vue.$store.commit('addCartItem', {
          amount: amount,
          nonprofit: vue.nonprofit
        })

        $(vue.$refs.donationModalOptions).fadeOut(function () {
          vue.removeModal('donation-tiers')
          vue.removeBodyClasses('has-donation-overlay')
          vue.addModal('donation-cart')
        })
      }
    }
  }
}
</script>
