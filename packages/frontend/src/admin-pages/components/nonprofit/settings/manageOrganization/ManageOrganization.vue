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
        <api-error v-model="apiError" />

        <div
          v-if="isAdmin"
          class="o-page-header"
        >
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
              <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
            </nav>
            <h1
              v-if="nonprofit.legalName"
              class="o-page-header-title"
            >
              Manage {{ nonprofit.legalName }}'s Organization Info
            </h1>
          </div>
        </div>

        <div
          v-else
          class="o-page-header"
        >
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Manage Organization Info
            </h1>
          </div>
        </div>

        <form @submit="submit">
          <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
            <div class="c-page-section__main">
              <div
                v-if="isAdmin"
                class="c-form-item c-form-item--text c-form-item--required"
                :class="{ 'c-form-item--has-error': formErrors.legalName }"
              >
                <div class="c-form-item__label">
                  <label
                    for="legalName"
                    class="c-form-item-label-text"
                  >Legal Name</label>
                </div>
                <div class="c-form-item__control">
                  <input
                    id="legalName"
                    v-model="formData.legalName"
                    v-auto-focus
                    type="text"
                    name="legalName"
                    maxlength="200"
                    :class="{ 'has-error': formErrors.legalName }"
                  >
                  <div
                    v-if="formErrors.legalName"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.legalName }}
                  </div>
                </div>
              </div>

              <div
                class="c-form-item c-form-item--text c-form-item--required"
                :class="{ 'c-form-item--has-error': formErrors.taxId }"
              >
                <div class="c-form-item__label">
                  <label
                    for="taxId"
                    class="c-form-item-label-text"
                  >Tax ID</label>
                </div>
                <div class="c-form-item__control">
                  <input
                    id="taxId"
                    v-model="formData.taxId"
                    v-auto-focus
                    type="text"
                    name="taxId"
                    :class="{ 'has-error': formErrors.taxId }"
                  >
                  <div
                    v-if="formErrors.taxId"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.taxId }}
                  </div>
                </div>
              </div>

              <hr class="expand">

              <div class="c-form-item c-form-item--control-group c-form-item--control-group--address">
                <div class="c-form-item__label">
                  <div class="c-form-item-label-text">
                    Address
                  </div>
                </div>

                <div class="c-form-item__control u-margin-top-thick">
                  <div class="c-form-control-grid">
                    <div class="c-form-control-grid__item c-form-item--required">
                      <div
                        v-floating-label
                        class="has-floating-label js-floating-label"
                      >
                        <input
                          id="address1"
                          v-model="formData.address1"
                          type="text"
                          name="address1"
                          :class="{ 'has-error': formErrors.address1 }"
                        >
                        <label for="address1">Address Line 1</label>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="formErrors.address1"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                  >
                    {{ formErrors.address1 }}
                  </div>

                  <div class="c-form-control-grid">
                    <div class="c-form-control-grid__item">
                      <div
                        v-floating-label
                        class="has-floating-label js-floating-label"
                      >
                        <input
                          id="address2"
                          v-model="formData.address2"
                          type="text"
                          name="address2"
                          :class="{ 'has-error': formErrors.address2 }"
                        >
                        <label for="address2">Address Line 2</label>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="formErrors.address2"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                  >
                    {{ formErrors.address2 }}
                  </div>

                  <div class="c-form-control-grid">
                    <div class="c-form-control-grid__item c-form-item--required">
                      <div
                        v-floating-label
                        class="has-floating-label js-floating-label"
                      >
                        <input
                          id="city"
                          v-model="formData.city"
                          type="text"
                          name="city"
                          :class="{ 'has-error': formErrors.city }"
                        >
                        <label for="city">City</label>
                      </div>
                    </div>

                    <div
                      id="addressGroupDefaultCountryOptions-US"
                      class="c-form-control-grid__item c-form-item--required u-flex-collapse"
                    >
                      <state-select
                        id="state"
                        v-model="formData.state"
                        name="state"
                        placeholder="State"
                        :class="{ 'has-error': formErrors.state }"
                      />
                    </div>

                    <div
                      class="c-form-control-grid__item c-form-item--required"
                      style="flex: 1 0 11rem; max-width: 11rem;"
                    >
                      <div
                        v-floating-label
                        class="has-floating-label js-floating-label"
                      >
                        <input
                          id="zip"
                          v-model="formData.zip"
                          type="text"
                          name="zip"
                          :class="{ 'has-error': formErrors.zip }"
                        >
                        <label for="zip">ZIP Code</label>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="formErrors.city || formErrors.state || formErrors.zip"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                  >
                    <span v-if="formErrors.city">{{ formErrors.city }}. </span><span v-if="formErrors.state">{{ formErrors.state }}. </span><span
                      v-if="formErrors.zip"
                    >{{ formErrors.zip }}.</span>
                  </div>
                </div>
              </div>

              <div
                class="c-form-item c-form-item--text c-form-item--required"
                :class="{ 'c-form-item--has-error': formErrors.phone }"
              >
                <div class="c-form-item__label">
                  <label
                    for="legalName"
                    class="c-form-item-label-text"
                  >Phone #</label>
                </div>
                <div class="c-form-item__control">
                  <div class="u-control-icon u-control-icon--tel">
                    <input
                      id="phone"
                      v-model="formData.phone"
                      type="text"
                      name="phone"
                      :class="{ 'has-error': formErrors.phone }"
                    >
                  </div>
                  <div
                    v-if="formErrors.phone"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error"
                  >
                    {{ formErrors.phone }}
                  </div>
                </div>
              </div>

              <hr class="expand">

              <div class="c-form-item c-form-item--select">
                <p>
                  Specify up to 3 categories that describe this nonprofit.
                </p>
                <div class="c-form-item__control">
                  <div class="c-form-control-grid">
                    <div
                      class="c-form-control-grid__item u-flex u-items-center"
                      style="flex: 1 0 8rem; max-width: 8rem;"
                    >
                      <label
                        for="category1"
                        class="c-form-item-label-text"
                      >Category #1</label>
                    </div>
                    <div class="c-form-control-grid__item">
                      <category-select
                        id="category1"
                        v-model="formData.category1"
                        name="category1"
                        :options="category1Options"
                        :class="{ 'has-error': formErrors.category1 }"
                      />
                    </div>
                  </div>
                  <div
                    v-if="formErrors.category1"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                  >
                    {{ formErrors.category1 }}
                  </div>

                  <div class="c-form-control-grid">
                    <div
                      class="c-form-control-grid__item u-flex u-items-center"
                      style="flex: 1 0 8rem; max-width: 8rem;"
                    >
                      <label
                        for="category2"
                        class="c-form-item-label-text"
                      >Category #2</label>
                    </div>
                    <div class="c-form-control-grid__item">
                      <category-select
                        id="category2"
                        v-model="formData.category2"
                        name="category2"
                        :options="category2Options"
                        :allow-empty="true"
                        :class="{ 'has-error': formErrors.category2 }"
                      />
                    </div>
                  </div>
                  <div
                    v-if="formErrors.category2"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                  >
                    {{ formErrors.category2 }}
                  </div>

                  <div class="c-form-control-grid">
                    <div
                      class="c-form-control-grid__item u-flex u-items-center"
                      style="flex: 1 0 8rem; max-width: 8rem;"
                    >
                      <label
                        for="category3"
                        class="c-form-item-label-text"
                      >Category #3</label>
                    </div>
                    <div class="c-form-control-grid__item">
                      <category-select
                        id="category3"
                        v-model="formData.category3"
                        name="category3"
                        :options="category3Options"
                        :allow-empty="true"
                        :class="{ 'has-error': formErrors.category3 }"
                      />
                    </div>
                  </div>
                  <div
                    v-if="formErrors.category3"
                    class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick"
                  >
                    {{ formErrors.category3 }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
            <header class="c-page-section__header">
              <div class="c-page-section-header-text">
                <h2 class="c-page-section-title">
                  Event Agreements
                </h2>
              </div>
            </header>
            <div class="c-page-section__main">
              <div class="c-form-item c-form-item--checkbox">
                <div class="c-form-item__control">
                  <ul class="c-input-list c-input-list--checkbox">
                    <li v-for="agreement in agreements">
                      <input
                        :id="'agreementId-'+agreement.id"
                        v-model="formData.agreedIds"
                        type="checkbox"
                        name="agreementId[]"
                        :value="agreement.id"
                      >
                      <label :for="'agreementId-'+agreement.id">
                        {{ agreement.agreementTitle }}
                        <span
                          v-if="agreement.isRequired"
                          class="c-label c-label--bad"
                        >Required</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <footer class="c-form-actions">
            <button
              type="submit"
              class="c-btn"
            >
              Save Changes
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
import ComponentSelectNonprofitCategory from './../../../forms/SelectNonprofitCategory.vue'
import ComponentSelectState from './../../../forms/SelectState.vue'

export default {
  components: {
    'category-select': ComponentSelectNonprofitCategory,
    'state-select': ComponentSelectState
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      return Promise.all([
        vue.$request.get('agreements').then(response => { vue.agreements = response.data }),
        vue.$request.get('/nonprofits/' + to.params.nonprofitId).then(response => { vue.nonprofit = response.data })
      ])
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
  props: {
    nonprofitId: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      nonprofit: {},
      agreements: [],
      loaded: false,

      formData: {
        legalName: '',
        taxId: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        category1: '',
        category2: '',
        category3: '',

        agreedIds: []
      },

      categoryOptions: [
        { value: 1, text: 'Animal-Related' },
        { value: 2, text: 'Arts, Culture & Humanities' },
        { value: 3, text: 'Children & Families' },
        { value: 4, text: 'Civil Rights, Social Action & Advocacy' },
        { value: 5, text: 'Community Improvement & Capacity Building' },
        { value: 6, text: 'Crime & Legal-Related' },
        { value: 7, text: 'Diseases, Disorders & Medical Disciplines' },
        { value: 8, text: 'Education-Early Childhood' },
        { value: 9, text: 'Education-Higher Education' },
        { value: 10, text: 'Education-K-12' },
        { value: 11, text: 'Environment' },
        { value: 12, text: 'Food, Agriculture & Nutrition' },
        { value: 13, text: 'Health Care' },
        { value: 14, text: 'Housing & Shelter' },
        { value: 15, text: 'Human Services' },
        { value: 16, text: 'International, Foreign Affairs & National Security' },
        { value: 17, text: 'Library & Literacy Programs' },
        { value: 18, text: 'Medical Research' },
        { value: 19, text: 'Mental Health & Crisis Intervention' },
        { value: 20, text: 'Mutual & Membership Benefit' },
        { value: 21, text: 'Older Adults' },
        { value: 22, text: 'Philanthropy, Voluntarism & Grantmaking Foundations' },
        { value: 23, text: 'Politics & Public Administration' },
        { value: 24, text: 'Public & Societal Benefit' },
        { value: 25, text: 'Public Safety, Disaster Preparedness & Relief' },
        { value: 26, text: 'Recreation & Sports' },
        { value: 27, text: 'Religion-Related' },
        { value: 28, text: 'Science & Technology' },
        { value: 29, text: 'Veterans Support' },
        { value: 30, text: 'Women' },
        { value: 31, text: 'Youth Development' }
      ],

      // Errors
      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    isAdmin: function () {
      return this.isSuperAdminUser() || this.isAdminUser()
    },
    category1Options: function () {
      const vue = this
      return _.forEach(_.cloneDeep(vue.categoryOptions), function (option) {
        if (option.value === vue.formData.category2 || option.value === vue.formData.category3) {
          option.disabled = true
        }
      })
    },
    category2Options: function () {
      const vue = this
      return _.forEach(_.cloneDeep(vue.categoryOptions), function (option) {
        if (option.value === vue.formData.category1 || option.value === vue.formData.category3) {
          option.disabled = true
        }
      })
    },
    category3Options: function () {
      const vue = this
      return _.forEach(_.cloneDeep(vue.categoryOptions), function (option) {
        if (option.value === vue.formData.category1 || option.value === vue.formData.category2) {
          option.disabled = true
        }
      })
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
    nonprofit: {
      handler: function () {
        const vue = this

        vue.formData = vue.sync(vue.formData, vue.nonprofit)
        vue.formData.agreedIds = vue.nonprofit.NonprofitAgreements.filter(a => a.isChecked).map(a => a.agreementId)
        vue.loaded = true
        vue.removeModal('spinner')
      },
      deep: true
    }
  },
  created: function () {
    const vue = this

    vue.addModal('spinner')
  },
  methods: {
    getConstraints: function () {
      const vue = this

      const constraints = {
        taxId: {
          presence: true
        },
        address1: {
          label: 'Address line 1',
          presence: true
        },
        address2: {
          label: 'Address line 2',
          presence: false
        },
        city: {
          presence: true
        },
        state: {
          presence: true
        },
        zip: {
          label: 'Zip code',
          presence: true
        },
        phone: {
          label: 'Phone #',
          presence: true
        },
        category1: {
          label: 'Category #1',
          presence: true
        },
        category2: {
          label: 'Category #2',
          presence: false
        },
        category3: {
          label: 'Category #3',
          presence: false
        }
      }

      if (vue.isAdmin) {
        constraints.legalName = {
          presence: true
        }
      }

      return constraints
    },
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('spinner')

      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.clearModals()
      } else {
        vue.updateNonprofit()
      }
    },
    updateNonprofit: function () {
      const vue = this

      const params = vue.getUpdatedParameters(vue.formData, vue.nonprofit)
      if (Object.keys(params).length === 0) {
        vue.clearModals()
        vue.$router.push({ name: 'nonprofit-settings-list' })
        return
      }

      params.NonprofitAgreements = vue.agreements.map(agreement => {
        return { agreementId: agreement.id, isChecked: params.agreedIds.includes(agreement.id) }
      })
      delete params.agreedIds

      vue.$request.patch('nonprofits/' + vue.nonprofitId, params).then(function (response) {
        vue.clearModals()
        if (response.data.errorMessage) {
          console.log(response.data)
        } else {
          vue.$router.push({ name: 'nonprofit-settings-list' })
        }
      }).catch(function (err) {
        vue.clearModals()
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
