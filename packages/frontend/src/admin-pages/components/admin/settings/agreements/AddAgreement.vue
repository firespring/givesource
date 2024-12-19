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
    <navigation />
    <main id="main-content" class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-page-header">
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
              <span><router-link :to="{ name: 'settings-agreements' }">Event Agreements</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Add Agreement
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <api-error v-model="apiError" />

          <!-- BEGIN form -->
          <form @submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Agreement Info
                  </h2>
                </div>
              </header>

              <div class="c-page-section__main">
                <div class="c-form-item c-form-item--text c-form-item--required">
                  <div class="c-form-item__label">
                    <label
                      for="agreementTitle"
                      class="c-form-item-label-text"
                    >Agreement Title</label>
                  </div>

                  <div class="c-form-item__control">
                    <input
                      id="agreementTitle"
                      v-model="formData.agreementTitle"
                      v-auto-focus
                      type="text"
                      name="agreementTitle"
                      maxlength="200"
                      :class="{ 'has-error': formErrors.agreementTitle }"
                      required
                    >
                    <div
                      v-if="formErrors.agreementTitle"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.agreementTitle }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--textarea c-form-item--required">
                  <div class="c-form-item__label">
                    <label
                      for="agreementText"
                      class="c-form-item-label-text"
                    >Agreement Text</label>
                  </div>

                  <div class="c-form-item__control">
                    <forms-ckeditor
                      id="formText"
                      v-model="formData.agreementText"
                      type="advanced"
                    />
                    <div
                      v-if="formErrors.agreementText"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors.agreementText }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--radio">
                  <div class="c-form-item__label">
                    <div
                      id="isRequired"
                      class="c-form-item-label-text"
                    >
                      Is This Agreement Required?
                    </div>

                    <div class="c-notes">
                      If set to "Yes," then the registrant must agree to this agreement in order to complete their registration.
                    </div>
                  </div>

                  <div class="c-form-item__control">
                    <ul
                      class="c-input-list c-input-list--radio"
                      aria-labelledby="isRequired"
                    >
                      <li>
                        <input
                          id="isRequired-1"
                          v-model="formData.isRequired"
                          type="radio"
                          name="isRequired"
                          value="1"
                        >
                        <label for="isRequired-1">Yes</label>
                      </li>
                      <li>
                        <input
                          id="isRequired-0"
                          v-model="formData.isRequired"
                          type="radio"
                          name="isRequired"
                          value="0"
                        >
                        <label for="isRequired-0">No</label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- BEGIN form actions -->
            <footer class="c-form-actions">
              <button
                type="submit"
                class="c-btn"
              >
                Save Changes
              </button>
              <router-link
                :to="{ name: 'settings-agreements' }"
                class="c-btn c-btn--neutral c-btn--text"
              >
                Cancel
              </router-link>
            </footer>
            <!-- END form actions -->
          </form>
          <!-- END form -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ComponentCKEditor from './../../../forms/Ckeditor.vue'

export default {
  components: {
    'forms-ckeditor': ComponentCKEditor
  },
  data: function () {
    return {
      settings: [],

      // Form Data
      formData: {
        agreementTitle: '',
        agreementText: '',
        isRequired: '0'
      },

      // Errors
      formErrors: {},
      apiError: {}
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
        agreementTitle: {
          label: 'Agreement Title',
          presence: true
        },
        agreementText: {
          label: 'Agreement Text',
          presence: true
        }
      }
    },
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('spinner')

      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.removeModal('spinner')
      } else {
        vue.addAgreement()
      }
    },
    addAgreement: function () {
      const vue = this

      const formData = { ...vue.formData }
      vue.$request.post('agreements', formData).then(function (response) {
        vue.removeModal('spinner')
        if (response.data && response.data.errorMessage) {
          console.log(response.data)
        } else {
          vue.$router.push({ name: 'settings-agreements' })
        }
      }).catch(function (err) {
        vue.removeModal('spinner')
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
