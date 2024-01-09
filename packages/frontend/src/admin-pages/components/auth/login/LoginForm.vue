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
    v-if="displayAuthorizing"
    class="c-page-section__main"
  >
    <authorizing />
  </div>
  <div
    v-else
    class="c-page-section__main"
  >
    <h4>Log in with your account info.</h4>

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

    <form @submit="submit">
      <div class="c-form-item c-form-item--email c-form-item--required c-form-item--compact">
        <div class="c-form-item__control">
          <div
            v-floating-label
            class="u-control-icon u-control-icon--email has-floating-label js-floating-label"
          >
            <input
              id="email"
              v-model="formData.email"
              v-auto-focus
              type="email"
              name="email"
              :class="{ 'has-error': formErrors.email }"
            >
            <label for="email">Email Address</label>
          </div>
          <div
            v-if="formErrors.email"
            class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
          >
            {{ formErrors.email }}
          </div>
        </div>
      </div>

      <div class="c-form-item c-form-item--password c-form-item--required c-form-item--compact">
        <div class="c-form-item__control">
          <div
            v-floating-label
            class="u-control-icon u-control-icon--password has-floating-label js-floating-label"
          >
            <input
              id="password"
              v-model="formData.password"
              type="password"
              name="password"
              :class="{ 'has-error': formErrors.password }"
            >
            <label for="password">Password</label>
          </div>
          <div
            v-if="formErrors.password"
            class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
          >
            {{ formErrors.password }}
          </div>
          <div class="c-notes c-notes--below">
            <router-link :to="{ name: 'forgot-password' }">
              Forget your password?
            </router-link>
            <br>
          </div>
        </div>
      </div>

      <footer class="c-form-actions c-form-actions--compact">
        <button
          type="submit"
          class="c-btn c-btn--good"
        >
          Log In
        </button>
      </footer>
    </form>
  </div>
</template>

<script>
import ComponentAuthorizingSpinner from './../AuthorizingSpinner.vue'

const User = require('../../../helpers/user')

export default {
  components: {
    authorizing: ComponentAuthorizingSpinner
  },
  emits: [
    'set-cognito-user',
    'set-user-attributes',
    'set-main-component',
    'set-display-header',
    'set-display-links'
  ],
  data: function () {
    return {
      displayAuthorizing: false,

      // Form Data
      formData: {
        email: '',
        password: ''
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
  beforeMount: function () {
    const vue = this

    vue.loginWithQueryParams()
  },
  methods: {
    getConstraints: function () {
      return {
        email: {
          label: 'Email address',
          presence: true,
          email: true
        },
        password: {
          presence: true
        }
      }
    },
    submit: function (event) {
      const vue = this
      event.preventDefault()

      vue.toggleAuthorizing(true)
      vue.errors = []
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.toggleAuthorizing(false)
      } else {
        vue.login()
      }
    },
    loginWithQueryParams: function () {
      const vue = this
      if (vue.$route.query.id && vue.$route.query.token) {
        vue.toggleAuthorizing(true)
        vue.login(vue.$route.query.id, vue.$route.query.token)
      }
    },
    login: function (id, token) {
      const vue = this
      const username = id || vue.formData.email
      const password = token || vue.formData.password

      User.login(username, password, {
        onSuccess: function () {
          if (vue.$route.query.redirect) {
            vue.$router.push({ path: decodeURIComponent(vue.$route.query.redirect) })
          } else {
            vue.$router.push({ name: 'homepage' })
          }
        },
        onFailure: function (err) {
          console.log(err)
          vue.toggleAuthorizing(false)
          vue.errors.push('Incorrect username or password.')
        },
        mfaRequired: function (codeDeliveryDetails, cognitoUser) {
          vue.toggleAuthorizing(false)
          vue.$emit('set-cognito-user', cognitoUser)
          // TODO: handle mfa
          // vue.cognitoUser.sendMFACode(mfaCode, this);
        },
        newPasswordRequired: function (userAttributes, requiredAttributes, cognitoUser) {
          vue.toggleAuthorizing(false)
          vue.$emit('set-cognito-user', cognitoUser)
          vue.$emit('set-user-attributes', userAttributes)
          vue.$emit('set-main-component', 'password-reset-form')
        }
      })
    },
    toggleAuthorizing: function (toggle) {
      const vue = this

      if (toggle) {
        vue.displayAuthorizing = true
        vue.$emit('set-display-header', false)
        vue.$emit('set-display-links', false)
      } else {
        vue.displayAuthorizing = false
        vue.$emit('set-display-header', true)
        vue.$emit('set-display-links', true)
      }
    }
  }
}
</script>
