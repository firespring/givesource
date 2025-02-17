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
  <div class="main__metrics">
    <api-error v-model="apiError" />

    <div class="main__spotlight wrapper text-c">
      <div
        v-if="displayDonationTotals"
        class="main-spotlight-section day-totals"
      >
        <div>We’ve received</div>
        <div class="day-totals__numbers day-totals__numbers--donations-num">
          <div
            v-for="digit in donationsCountArray"
            :class="metricClass(digit)"
          >
            {{ digit }}
          </div>
        </div>
        <div>donations for</div>
        <div class="day-totals__numbers day-totals__numbers--donations-amount">
          <div
            v-for="digit in donationsTotalArray"
            :class="metricClass(digit)"
          >
            {{ digit }}
          </div>
        </div>
      </div>

      <div
        v-if="displayEventCountdown && countdown.loaded"
        class="main-spotlight-section countdown"
      >
        {{ countdownPrefix }}
        <span class="countdown__timer">
          <span v-if="countdown.days > 0">{{ countdown.days }} days,</span>
          <span v-if="countdown.days > 0 || countdown.hours > 0">{{ countdown.hours }} hours,</span>
          <span v-if="countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0">{{ countdown.minutes }} minutes, and</span>
          <span v-if="countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds >= 0">{{ countdown.seconds }} seconds</span>
        </span>
        {{ countdownSuffix }}
        <sup>
          <a
            id="timer__close"
            href="#"
            role="button"
            title="Hide Countdown"
            aria-label="Hide Countdown"
            @click.prevent="countdownHidden = true"
          ><i
            class="fas fa-times-circle"
            aria-hidden="true"
          /></a>
        </sup>
      </div>

      <div class="main-spotlight-section nonprofit-search">
        <form
          class="nonprofit-search__name"
          @submit="submitSearch"
        >
          <div class="form-item">
            <div class="form-item__label">
              <label for="nonprofitName">Search by Name</label>
            </div>
            <div class="form-item__control">
              <div class="grid--mobile grid--compact grid--middle grid--row">
                <div class="grid-item">
                  <div class="search-wrap">
                    <input
                      id="nonprofitName"
                      v-model="formData.search"
                      type="search"
                      name="nonprofitName"
                      placeholder="Enter Keywords"
                    >
                  </div>
                  <div
                    v-if="formErrors.search"
                    class="notes notes--below notes--error"
                  >
                    {{ formErrors.search }}
                  </div>
                </div>

                <div class="grid-item grid-item--collapse">
                  <button
                    type="submit"
                    class="btn btn--dark"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <form class="nonprofit-search__category">
          <div class="form-item">
            <div class="form-item__label">
              <label for="nonprofitCategory">Search by Category</label>
            </div>
            <div class="form-item__control">
              <div class="select-wrap">
                <forms-nonprofit-category-select
                  v-model="category"
                  placeholder="Select a category"
                />
              </div>
            </div>
          </div>
        </form>

        <div
          v-if="displayMatchFund && canDonate"
          class="nonprofit-search__love"
        >
          <div class="mb3">
            <router-link
              class="btn btn--accent btn--lg"
              :to="{ name: 'nonprofit-landing-page', params: {slug: matchFundNonprofit.slug} }"
            >
              {{ matchFundButtonText }}
            </router-link>
          </div>
          <div
            v-if="matchFundDetails"
            class="notes"
          >
            {{ matchFundDetails }}
          </div>
        </div>

        <div class="nonprofit-search__see-all">
          <router-link :to="{ name: 'search-results' }">
            See All Nonprofits
          </router-link>
        </div>
      </div>

      <div
        v-if="displayRegisterButton"
        class="main-spotlight-section register wrapper wrapper--xs"
      >
        <div class="register__action mb4">
          <router-link
            :to="{ name: 'register' }"
            class="btn btn--accent btn--round btn--lg"
          >
            {{ registerButtonText }}
          </router-link>
        </div>
        <div
          v-if="registerDetails"
          class="register__details"
          v-html="registerDetails"
        />
      </div>

      <div
        v-if="displaySendReceiptForm || eventEnded"
        class="main-spotlight-section wrapper wrapper--xs"
      >
        <form
          class="mb4"
          @submit="submitReceiptRequest"
        >
          <div>
            <strong><label for="email">Enter your email and we'll send you a receipt for all of your donations this year.</label></strong>
          </div>
          <div
            class="grid justify-center items-center"
            style="max-width: 640px; margin: .5rem auto 0;"
          >
            <div class="grid-item grid-item--expand">
              <input
                id="email"
                v-model="formData.email"
                type="text"
                name="email"
                placeholder="Your Email Address"
                :class="{'has-error': formErrors.email}"
              >
              <div
                v-if="formErrors.email"
                class="notes notes--below notes--error"
              >
                {{ formErrors.email }}
              </div>
            </div>
            <div class="grid-item grid-item--collapse">
              <forms-submit
                :processing="processing"
                color="accent"
                :rounded="false"
                :has-icon="false"
              >
                Send Email
              </forms-submit>
            </div>
          </div>
        </form>
        <p
          v-if="eventEnded"
          v-html="postEventText"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as Utils from './../../helpers/utils'
import * as Settings from './../../helpers/settings'
import ComponentNonprofitCategorySelect from './../forms/NonprofitCategorySelect.vue'
import ComponentSubmit from './../forms/Submit.vue'

const numeral = require('numeral')

export default {
  components: {
    'forms-nonprofit-category-select': ComponentNonprofitCategorySelect,
    'forms-submit': ComponentSubmit
  },
  props: {
    matchFundEnabled: {
      type: [Boolean, String],
      default: false
    },
    matchFundButtonText: {
      type: String,
      default: null
    },
    matchFundDetails: {
      type: String,
      default: null
    },
    matchFundNonprofit: {
      type: Object,
      default: null
    },
    registerButtonText: {
      type: String,
      default: null
    },
    registerDetails: {
      type: String,
      default: null
    },
    postEventText: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      category: '',
      processing: false,
      eventEnded: false,

      // Form Data
      formData: {
        email: '',
        search: ''
      },

      // Errors
      formErrors: {},
      apiError: {},

      countdown: {
        loaded: false,
        timer: 0,
        type: null,

        days: null,
        hours: null,
        minutes: null,
        seconds: null
      },

      countdownHidden: false,

      metrics: {
        DONATIONS_COUNT: 0,
        DONATIONS_TOTAL: 0,
        DONORS_COUNT: 0,
        TOP_DONATION: 0
      }
    }
  },
  computed: {
    eventTitle: function () {
      return Settings.eventTitle()
    },
    countdownPrefix: function () {
      return this.countdown.type === 'event' ? 'You have' : 'There are'
    },
    countdownSuffix: function () {
      if (this.countdown.type === 'event') {
        return 'left to make a donation.'
      }
      return this.eventTitle ? 'until ' + this.eventTitle + ' begins.' : 'until the event beings.'
    },
    displayEventCountdown: function () {
      return !this.countdownHidden && (Settings.isBeforeEvent() || Settings.isDuringEvent())
    },
    displayRegisterButton: function () {
      const vue = this

      if (!vue.registerButtonText) {
        return false
      }

      return Settings.isDuringRegistrations()
    },
    displaySendReceiptForm: function () {
      return Settings.isAfterEvent()
    },
    displayDonationTotals: function () {
      return Settings.isDuringEvent() || Settings.isAfterEvent()
    },
    donationsCountArray: function () {
      return numeral(this.metrics.DONATIONS_COUNT).format('0,000').split('')
    },
    donationsTotalArray: function () {
      return numeral(this.metrics.DONATIONS_TOTAL / 100).format('$0,00.00').split('')
    },
    canDonate: function () {
      return Settings.isDuringDonations() || Settings.isDuringEvent()
    },
    displayMatchFund: function () {
      const vue = this
      return (vue.matchFundEnabled === '1' && vue.matchFundNonprofit)
    }
  },
  watch: {
    category: function (value) {
      if (value) {
        this.$router.push({ name: 'search-results', query: { category: value } })
      }
    },
    formData: {
      handler: function () {
        const vue = this
        if (Object.keys(vue.formErrors).length) {
          if (vue.displaySendReceiptForm) {
            vue.formErrors = vue.validate(vue.formData, vue.getReceiptConstraints())
          } else {
            vue.formErrors = vue.validate(vue.formData, vue.getSearchConstraints())
          }
        }
      },
      deep: true
    }
  },
  created: function () {
    const vue = this

    axios.get(API_URL + 'metrics' + Utils.generateQueryString({ keys: Object.keys(vue.metrics) })).then(function (response) {
      vue.metrics = response.data
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
    })

    if (vue.displayEventCountdown) {
      vue.initializeCountdown()
    }
    if (Settings.isAfterEvent()) {
      vue.eventEnded = true
    }
  },
  methods: {
    initializeCountdown: function () {
      const vue = this

      let countdown = {}
      vue.countdown.timer = setInterval(function () {
        if (Settings.isAfterEvent()) {
          vue.countdown.loaded = false
          vue.eventEnded = true
          clearInterval(vue.countdown.timer)
          return
        }

        if (Settings.isBeforeEvent()) {
          vue.countdown.type = 'preEvent'
          countdown = Settings.countdownUntilEventStart()
        }

        if (Settings.isDuringEvent()) {
          vue.countdown.type = 'event'
          countdown = Settings.countdownUntilEventEnd()
        }

        vue.countdown.days = countdown.days
        vue.countdown.hours = countdown.hours
        vue.countdown.minutes = countdown.minutes
        vue.countdown.seconds = countdown.seconds
        vue.countdown.loaded = true
      }, 1000)
    },
    getReceiptConstraints: function () {
      return {
        email: {
          presence: true,
          email: true
        }
      }
    },
    getSearchConstraints: function () {
      return {
        search: {
          presence: false,
          length: {
            minimum: 3
          }
        }
      }
    },
    submitReceiptRequest: function (event) {
      event.preventDefault()
      const vue = this

      vue.formErrors = vue.validate(vue.formData, vue.getReceiptConstraints())
      if (!Object.keys(vue.formErrors).length) {
        vue.processing = true
        vue.requestReceipt()
      }
    },
    submitSearch: function (event) {
      event.preventDefault()
      const vue = this

      vue.formErrors = vue.validate(vue.formData, vue.getSearchConstraints())
      if (!Object.keys(vue.formErrors).length) {
        vue.searchNonprofits()
      }
    },
    requestReceipt: function () {
      const vue = this

      axios.post(API_URL + 'donations/receipt', {
        email: vue.formData.email
      }).then(function () {
        vue.formData.email = ''
        vue.processing = false
        // TODO: redirect to thank-you page
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
        vue.processing = false
      })
    },
    searchNonprofits: function () {
      const vue = this

      vue.$router.push(vue.generatePageLink({ search: vue.formData.search }))
    },
    metricClass: function (digit) {
      return /^\d+$/.test(digit) ? 'number' : 'text'
    },
    generatePageLink: function (query) {
      const vue = this
      query = query || {}
      query = _.extend({}, vue.$route.query, query)
      Object.keys(query).forEach(function (key) {
        if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
          delete query[key]
        }
      })
      return {
        name: 'search-results',
        query: query
      }
    }
  }
}
</script>
