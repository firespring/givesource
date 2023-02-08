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
    <navigation :nonprofit-id="nonprofitId" />
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-page-header">
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Request Name Change
            </h1>
          </div>
        </div>

        <form @submit="submit">
          <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
            <div class="c-page-section__main">
              <div
                class="c-form-item c-form-item--text c-form-item--required"
                :class="{ 'c-form-item--has-error': formErrors.requestedName }"
              >
                <div class="c-form-item__label">
                  <label
                    for="requestedName"
                    class="c-form-item-label-text"
                  >Requested Name</label>
                </div>
                <div class="c-form-item__control">
                  <input
                    id="requestedName"
                    v-model="formData.requestedName"
                    v-auto-focus
                    type="text"
                    name="requestedName"
                    maxlength="200"
                    :class="{ 'has-error': formErrors.requestedName }"
                  >
                  <div
                    v-if="formErrors.requestedName"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.requestedName }}
                  </div>
                  <div
                    v-else
                    class="c-notes c-notes--below"
                  >
                    Your nonprofit's current name is: {{ nonprofit.legalName }}
                  </div>
                </div>
              </div>

              <div
                class="c-form-item c-form-item--textarea"
                :class="{ 'c-form-item--has-error': formErrors.changeReason }"
              >
                <div class="c-form-item__label">
                  <label
                    for="changeReasons"
                    class="c-form-item-label-text"
                  >Reasons for Name Change</label>
                </div>
                <div class="c-form-item__control">
                  <textarea
                    id="changeReasons"
                    v-model="formData.changeReason"
                    name="changeReasons"
                    :class="{ 'has-error': formErrors.changeReason }"
                  />
                  <div
                    v-if="formErrors.changeReason"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.changeReason }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer class="c-form-actions">
            <button
              type="submit"
              class="c-btn"
            >
              Submit Your Request
            </button>
            <router-link
              :to="{ name: 'nonprofit-settings-list' }"
              class="c-btn c-btn--neutral c-btn--text"
            >
              Cancel
            </router-link>
          </footer>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
        vue.nonprofit = response.data
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(function (response) {
      vue.nonprofit = response.data
      next()
    }).catch(function () {
      next()
    })
  },
  props: [
    'nonprofitId'
  ],
  data: function () {
    return {
      nonprofit: {},

      // Form Data
      formData: {
        requestedName: '',
        changeReason: ''
      },

      // Errors
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
  methods: {
    getConstraints: function () {
      return {
        requestedName: {
          presence: true
        },
        changeReason: {
          presence: false
        }
      }
    },
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('spinner')

      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.clearModals()
      } else {
        vue.submitRequest()
      }
    },
    submitRequest: function () {
      const vue = this

      const name = (vue.user.firstName && vue.user.lastName) ? vue.user.firstName + ' ' + vue.user.lastName : vue.nonprofit.legalName
      vue.$request.post('messages', {
        name: name,
        email: vue.user.email,
        message: vue.formatMessage(),
        type: 'NAME_CHANGE'
      }).then(function () {
        vue.clearModals()
        vue.$router.push({ name: 'nonprofit-settings-list' })
      }).catch(function (err) {
        console.log(err)
      })
    },
    formatMessage: function () {
      const vue = this

      let message = '<strong>Original Name:</strong> ' + vue.nonprofit.legalName + '<br>'
      message += '<strong>Requested Name:</strong> ' + vue.formData.requestedName + '<br>'
      message += '<strong>Reason:</strong> ' + vue.formData.changeReason

      return message
    }
  }
}
</script>
