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
  <div class="o-app o-app--no-nav o-app--centered">
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--xs">
        <section
          class="c-page-section c-page-section--border c-page-section--shadow"
          :class="{ 'c-page-section--headless': displayHeader }"
        >
          <header
            v-if="displayHeader"
            class="c-page-section__header u-justify-center"
          >
            <a href="#"><img
              alt="Givesource Logo"
              src="/img/logo-givesource.png"
              class="logo"
            ></a>
          </header>

          <component
            :is="mainComponent"
            :cognito-user="cognitoUser"
            :user-attributes="userAttributes"
            @set-main-component="setMainComponent"
            @set-display-header="setDisplayHeader"
            @set-display-links="setDisplayLinks"
            @set-cognito-user="setCognitoUser"
            @set-user-attributes="setUserAttributes"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import ComponentLoginForm from './LoginForm.vue'
import ComponentPasswordResetForm from './PasswordResetForm.vue'

export default {
  components: {
    'login-form': ComponentLoginForm,
    'password-reset-form': ComponentPasswordResetForm
  },
  data: function () {
    return {
      displayHeader: true,
      displayLinks: true,
      mainComponent: 'login-form',
      cognitoUser: null,
      userAttributes: null
    }
  },
  beforeMount: function () {
    document.body.classList.remove('has-menubar', 'has-menubar--secondary')
    document.body.classList.add('login')
  },
  methods: {
    setDisplayHeader: function (displayHeader) {
      this.displayHeader = displayHeader
    },
    setDisplayLinks: function (displayLinks) {
      this.displayLinks = displayLinks
    },
    setMainComponent: function (component) {
      this.mainComponent = component
    },
    setCognitoUser: function (cognitoUser) {
      this.cognitoUser = cognitoUser
    },
    setUserAttributes: function (userAttributes) {
      this.userAttributes = userAttributes
    }
  }
}
</script>
