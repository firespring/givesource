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

    <layout-hero :presented-by="true">
      <template #title>
        <h1>
          Register for {{ eventTitle }}
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <api-error v-model="apiError" />
      <div
        v-if="canRegister"
        class="wrapper wrapper--sm"
      >
        <div
          style="margin: 0 0 1.5rem;"
          v-html="text"
        />

        <form @submit="submit">
          <fieldset>
            <legend>Registration Form</legend>
            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="legalName">Organization Legal Name</label>
              </div>
              <div class="form-item__control">
                <input
                  id="legalName"
                  v-model="formData.legalName"
                  type="text"
                  name="legalName"
                  maxlength="200"
                  :class="{'has-error': formErrors.legalName}"
                  required
                  aria-describedby="legalNameErrors"
                >
                <div
                  v-if="formErrors.legalName"
                  id="legalNameErrors"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.legalName }}
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="taxId">Tax ID</label>
              </div>
              <div class="form-item__control">
                <input
                  id="taxId"
                  v-model="formData.taxId"
                  type="text"
                  name="taxId"
                  maxlength="200"
                  :class="{'has-error': formErrors.taxId}"
                  required
                  aria-describedby="taxIdErrors"
                >
                <div
                  v-if="formErrors.taxId"
                  id="taxIdErrors"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.taxId }}
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label id="contactNameLabel">Contact Name</label>
              </div>
              <div class="form-item__control">
                <div class="grid">
                  <div class="grid-item">
                    <label for="firstName">First Name</label>
                    <input
                      id="firstName"
                      v-model="formData.firstName"
                      type="text"
                      name="firstName"
                      maxlength="200"
                      :class="{'has-error': formErrors.firstName}"
                      required
                      aria-describedby="contactNameLabel contactNameErrors"
                    >
                  </div>
                  <div class="grid-item">
                    <label for="lastName">Last Name</label>
                    <input
                      id="lastName"
                      v-model="formData.lastName"
                      type="text"
                      name="lastName"
                      maxlength="200"
                      :class="{'has-error': formErrors.lastName}"
                      required
                      aria-describedby="contactNameLabel contactNameErrors"
                    >
                  </div>
                </div>
                <div
                  v-if="formErrors.firstName || formErrors.lastName"
                  id="contactNameErrors"
                  class="notes notes--below notes--error"
                >
                  Enter your first name and last name
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="contactEmail">Contact Email</label>
              </div>
              <div class="form-item__control">
                <input
                  id="contactEmail"
                  v-model="formData.email"
                  type="text"
                  name="email"
                  maxlength="200"
                  :class="{'has-error': formErrors.email}"
                  required
                  aria-describedby="emailErrors"
                >
                <div
                  v-if="formErrors.email"
                  id="emailErrors"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.email }}
                </div>
              </div>
            </div>

            <div class="form-item form-item--address form-item--required">
              <div class="form-item__label">
                <label id="addressLabel">Organization Address</label>
              </div>

              <div class="form-item__control">
                <div class="address1">
                  <label for="address1">Address Line 1</label>
                  <input
                    id="address1"
                    v-model="formData.address1"
                    type="text"
                    name="address1"
                    :class="{'has-error': formErrors.address1}"
                    required
                    aria-describedby="addressLabel address1Errors"
                  >
                  <div
                    v-if="formErrors.address1"
                    id="address1Errors"
                    class="notes notes--below notes--error"
                  >
                    {{ formErrors.address1 }}
                  </div>
                </div>

                <div class="address2">
                  <label for="address2">Address Line 2</label>
                  <input
                    id="address2"
                    v-model="formData.address2"
                    type="text"
                    name="address2"
                    aria-describedby="addressLabel"
                  >
                </div>

                <div class="city-state-zip">
                  <div class="city-state-zip__city">
                    <label for="city">City</label>
                    <input
                      id="city"
                      v-model="formData.city"
                      type="text"
                      name="city"
                      maxlength="200"
                      :class="{'has-error': formErrors.city}"
                      required
                      aria-describedby="addressLabel cszErrors"
                    >
                  </div>

                  <div class="city-state-zip__state select-wrap">
                    <label for="state">State</label>
                    <forms-address-state
                      id="state"
                      v-model="formData.state"
                      name="state"
                      placeholder="State"
                      required
                      aria-describedby="addressLabel cszErrors"
                    />
                  </div>

                  <div class="city-state-zip__zip has-floating-label has-floating-label--blank js-floating-label">
                    <label for="zip">Postal Code</label>
                    <input
                      id="zip"
                      v-model="formData.zip"
                      type="text"
                      name="zip"
                      maxlength="200"
                      :class="{'has-error': formErrors.zip}"
                      required
                      aria-describedby="addressLabel cszErrors"
                    >
                  </div>
                </div>
              </div>

              <div
                v-if="formErrors.city || formErrors.state || formErrors.zip"
                id="cszErrors"
                class="notes notes--below notes--error"
              >
                Enter your organization's city, state and zip code
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="phone">Organization Phone Number</label>
              </div>
              <div class="form-item__control">
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  name="phone"
                  :class="{'has-error': formErrors.phone}"
                  required
                  aria-describedby="phoneErrors"
                >
                <div
                  v-if="formErrors.phone"
                  id="phoneErrors"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.phone }}
                </div>
              </div>
            </div>

            <div class="form-item">
              <div
                id="orgCategories"
                class="form-item__label"
              >
                Organization Categories (Check up to 3)
              </div>
              <div class="form-item__control">
                <div
                  v-if="formErrors.categories"
                  id="categoryErrors"
                  class="notes notes--above notes--error"
                >
                  {{ formErrors.categories }}
                </div>
                <forms-nonprofit-category
                  v-model="formData.categories"
                  group-label="orgCategories"
                  error-label="categoryErrors"
                />
              </div>
            </div>
          </fieldset>

          <fieldset v-for="agreement in agreements">
            <legend>{{ agreement.agreementTitle }}</legend>
            <div class="form-item">
              <h2>{{ agreement.agreementTitle }}</h2>
              <div v-html="agreement.agreementText" />
            </div>
            <div
              class="form-item"
              :class="{'form-item--required': agreement.isRequired}"
            >
              <div
                :id="'agreement' + agreement.id + 'label'"
                class="form-item__label"
              >
                Do you agree to the <strong>{{ agreement.agreementTitle }}</strong>?
              </div>
              <div class="form-item__control">
                <ul class="list-plain list-checkbox">
                  <li>
                    <label :for="'agreement' + agreement.id">
                      <input
                        :id="'agreement' + agreement.id"
                        v-model="formData.agreedIds"
                        type="checkbox"
                        name="agreedIds[]"
                        :value="agreement.id"
                        :required="agreement.isRequired"
                        :aria-describedby="'agreedIds' + agreement.id + ' ' + 'agreement' + agreement.id + 'label'"
                      >
                      <span>Yes, I agree to the <strong>{{ agreement.agreementTitle }}</strong>.</span>
                    </label>
                  </li>
                </ul>
                <div
                  v-if="formErrors['agreedIds.'+agreement.id]"
                  :id="'agreedIds' + agreement.id"
                  class="notes notes--above notes--error"
                >
                  {{ formErrors['agreedIds.'+agreement.id] }}
                </div>
              </div>
            </div>
          </fieldset>

          <div class="form-actions flex justify-center items-center">
            <forms-submit
              :processing="processing"
              color="accent"
            >
              Register Now
            </forms-submit>
          </div>
        </form>
      </div>

      <div
        v-if="!canRegister && isBeforeRegistrations"
        class="wrapper wrapper--sm"
      >
        Registration for {{ eventTitle }} will open on {{ registrationStartDate }}.
        Thank you for your interest in making {{ eventTitle }} a big success!
      </div>

      <div
        v-if="!canRegister && isAfterRegistrations"
        class="wrapper wrapper--sm"
      >
        Registration for {{ eventTitle }} is now closed.
        Thank you for your help making {{ eventTitle }} a big success!
      </div>
    </main>

    <layout-footer>
      <layout-sponsors />
    </layout-footer>
  </div>
</template>

<script>
import * as Utils from './../../helpers/utils'
import * as Settings from './../../helpers/settings'
import ComponentAddressState from './../forms/AddressState.vue'
import ComponentFooter from './../layout/Footer.vue'
import ComponentHeader from './../layout/Header.vue'
import ComponentHero from './../layout/Hero.vue'
import ComponentNonprofitCategory from './../forms/NonprofitCategory.vue'
import ComponentSponsors from './../layout/Sponsors.vue'
import ComponentSubmit from './../forms/Submit.vue'

export default {
  components: {
    'forms-address-state': ComponentAddressState,
    'forms-nonprofit-category': ComponentNonprofitCategory,
    'forms-submit': ComponentSubmit,
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-sponsors': ComponentSponsors
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      return Promise.all([
        axios.get(API_URL + 'agreements').then(response => { vue.agreements = response.data }),
        axios.get(API_URL + 'contents' + Utils.generateQueryString({
          keys: 'REGISTER_FORM_TEXT'
        })).then(response => { vue.contents = response.data }).catch(function (err) {
          vue.apiError = err.response.data.errors
        })
      ])
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    axios.get(API_URL + 'contents' + Utils.generateQueryString({
      keys: 'REGISTER_FORM_TEXT'
    })).then(function (response) {
      vue.contents = response.data
      next()
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
      next()
    })
  },
  data: function () {
    return {
      agreements: [],
      contents: [],
      processing: false,

      formData: {
        legalName: '',
        taxId: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        categories: [],
        firstName: '',
        lastName: '',
        email: '',

        agreedIds: []
      },

      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    text: function () {
      const text = _.find(this.contents, { key: 'REGISTER_FORM_TEXT' })
      return text ? text.value : null
    },
    eventTitle: function () {
      return Settings.eventTitle()
    },
    registrationStartDate: function () {
      return Settings.registrationStartDate().format('MMMM DD YYYY')
    },
    canRegister: function () {
      return Settings.isDuringRegistrations()
    },
    isAfterRegistrations: function () {
      return Settings.isAfterRegistrations()
    },
    isBeforeRegistrations: function () {
      return Settings.isBeforeRegistrations()
    },
    constraints: function () {
      const vue = this
      return {
        legalName: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your organization\'s legal name'
          }
        },
        taxId: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your organization\'s tax ID number'
          }
        },
        address1: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your organization\'s address'
          }
        },
        address2: {
          label: 'Address line 2',
          presence: false
        },
        categories: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter at least one category for your organization'
          },
          length: {
            minimum: 1,
            maximum: 3,
            tooLong: 'Enter up to three categories for your organization'
          }
        },
        city: {
          presence: true
        },
        state: {
          presence: true
        },
        zip: {
          label: 'Zip',
          presence: true
        },
        phone: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your organization\'s phone number'
          }
        },
        firstName: {
          presence: true
        },
        lastName: {
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

        // reduces to uniq keys for each agreement to validate
        // e.g. 'agreedIds.10': { arrayIncludes: {...} }
        ...vue.agreements.filter(a => a.isRequired).reduce((acc, curr) => {
          acc['agreedIds.' + curr.id] = {
            label: '',
            arrayIncludes: {
              attributeName: 'agreedIds',
              required: [curr.id],
              message: `You must agree to "${curr.agreementTitle}"`
            }
          }
          return acc
        }, {})

      }
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
  beforeMount: function () {
    const vue = this

    vue.setBodyClasses('page')
    vue.setPageTitle(vue.eventTitle + ' - Register')
  },
  methods: {
    getConstraints: function () {
      const vue = this
      return vue.constraints
    },
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.processing = true
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.processing = false
      } else {
        vue.registerNonprofit()
      }
    },
    registerNonprofit: function () {
      const vue = this

      axios.post(API_URL + 'nonprofits/register', {
        nonprofit: {
          legalName: vue.formData.legalName,
          taxId: vue.formData.taxId,
          address1: vue.formData.address1,
          address2: vue.formData.address2,
          city: vue.formData.city,
          state: vue.formData.state,
          zip: vue.formData.zip,
          phone: vue.formData.phone,
          category1: vue.formData.categories.length >= 1 ? vue.formData.categories[0] : 0,
          category2: vue.formData.categories.length >= 2 ? vue.formData.categories[1] : 0,
          category3: vue.formData.categories.length >= 3 ? vue.formData.categories[2] : 0,

          NonprofitAgreements: vue.agreements.map(agreement => {
            return { agreementId: agreement.id, isChecked: vue.formData.agreedIds.includes(agreement.id) }
          })
        },
        user: {
          firstName: vue.formData.firstName,
          lastName: vue.formData.lastName,
          email: vue.formData.email
        }
      }).then(function (response) {
        vue.processing = false
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          vue.$router.push({ name: 'register-response' })
        }
      }).catch(function (err) {
        vue.processing = false
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
