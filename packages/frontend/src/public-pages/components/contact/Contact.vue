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
          Contact Us
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <div class="wrapper wrapper--sm">
        <api-error v-model="apiError" />

        <div
          style="margin: 0 0 1.5rem;"
          v-html="text"
        />

        <form @submit="submit">
          <fieldset>
            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="nameFirst">Your Name</label>
              </div>
              <div class="form-item__control">
                <div class="grid">
                  <div class="grid-item">
                    <input
                      id="nameFirst"
                      v-model="formData.firstName"
                      type="text"
                      name="nameFirst"
                      placeholder="First Name"
                      :class="{'has-error': formErrors.firstName}"
                    >
                  </div>
                  <div class="grid-item">
                    <input
                      id="nameLast"
                      v-model="formData.lastName"
                      type="text"
                      name="nameLast"
                      placeholder="Last Name"
                      :class="{'has-error': formErrors.lastName}"
                    >
                  </div>
                </div>
                <div
                  v-if="formErrors.firstName || formErrors.lastName"
                  class="notes notes--below notes--error"
                >
                  Enter your first name and last name
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="email">Your Email</label>
              </div>
              <div class="form-item__control">
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  name="email"
                  :class="{'has-error': formErrors.email}"
                >
                <div
                  v-if="formErrors.email"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.email }}
                </div>
              </div>
            </div>

            <div class="form-item">
              <div class="form-item__label">
                <label for="phone">Phone Number</label>
              </div>
              <div class="form-item__control">
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  name="phone"
                  :class="{'has-error': formErrors.phone}"
                >
                <div
                  v-if="formErrors.phone"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.phone }}
                </div>
              </div>
            </div>

            <div class="form-item form-item--required">
              <div class="form-item__label">
                <label for="questions">Your Questions</label>
              </div>
              <div class="form-item__control">
                <textarea
                  id="questions"
                  v-model="formData.message"
                  name="questions"
                  :class="{'has-error': formErrors.message}"
                />
                <div
                  v-if="formErrors.message"
                  class="notes notes--below notes--error"
                >
                  {{ formErrors.message }}
                </div>
              </div>
            </div>
          </fieldset>

          <div class="form-actions flex justify-center items-center">
            <forms-submit
              :processing="processing"
              color="accent"
            >
              Send Your Questions
            </forms-submit>
          </div>
        </form>

        <div
          v-if="contactPhone"
          class="notes text-c"
          style="margin-top: 1rem;"
        >
          (You can also call our support line at {{ contactPhone }}.)
        </div>
      </div>
    </main>

    <layout-footer>
      <layout-sponsors />
    </layout-footer>
  </div>
</template>

<script>
import * as Settings from './../../helpers/settings'
import * as Utils from './../../helpers/utils'
import ComponentFooter from './../layout/Footer.vue'
import ComponentHeader from './../layout/Header.vue'
import ComponentHero from './../layout/Hero.vue'
import ComponentSponsors from './../layout/Sponsors.vue'
import ComponentSubmit from './../forms/Submit.vue'

export default {
  components: {
    'forms-submit': ComponentSubmit,
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-sponsors': ComponentSponsors
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      axios.get(API_URL + 'contents' + Utils.generateQueryString({
        keys: 'CONTACT_FORM_TEXT'
      })).then(function (response) {
        vue.contents = response.data
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    axios.get(API_URL + 'contents' + Utils.generateQueryString({
      keys: 'CONTACT_FORM_TEXT'
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
      contents: [],
      processing: false,

      formData: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        message: ''
      },

      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    contactPhone: function () {
      return this.$store.setting('CONTACT_PHONE') || null
    },
    text: function () {
      const text = _.find(this.contents, { key: 'CONTACT_FORM_TEXT' })
      return text ? text.value : null
    },
    eventTitle: function () {
      return Settings.eventTitle()
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
    vue.setPageTitle(vue.eventTitle + ' - Contact Us')
  },
  methods: {
    getConstraints: function () {
      return {
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
          presence: false
        },
        message: {
          label: '',
          presence: {
            allowEmpty: false,
            message: 'Enter your questions'
          }
        }
      }
    },
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.processing = true
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())

      if (Object.keys(vue.formErrors).length) {
        vue.scrollToError()
        vue.processing = false
      } else {
        vue.sendMessage()
      }
    },
    sendMessage: function () {
      const vue = this

      axios.post(API_URL + 'messages', {
        name: vue.formData.firstName + ' ' + vue.formData.lastName,
        email: vue.formData.email,
        phone: vue.formData.phone,
        message: vue.formData.message,
        type: 'CONTACT'
      }).then(function (response) {
        vue.processing = false
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          vue.$router.push({ name: 'contact-response' })
        }
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
        vue.processing = false
      })
    }
  }
}
</script>
