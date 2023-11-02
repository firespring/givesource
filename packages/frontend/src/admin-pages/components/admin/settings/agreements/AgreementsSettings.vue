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
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-page-header">
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
            </nav>
            <h1 class="o-page-header-title">
              Event Agreements
            </h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <api-error v-model="apiError" />

          <!-- BEGIN header actions -->
          <div class="c-header-actions">
            <div>
              <router-link
                :to="{ name: 'settings-add-agreement' }"
                class="c-btn c-btn--sm c-btn--icon"
                role="button"
              >
                <i
                  class="fa fa-plus-circle"
                  aria-hidden="true"
                />Add Agreement
              </router-link>
            </div>
          </div>
          <!-- END header actions -->

          <div>
            <!-- BEGIN table -->
            <table class="table-middle table-reorder js-table-reorder">
              <thead>
                <tr>
                  <th class="u-width-100p">
                    Title
                  </th>
                  <th />
                  <th />
                </tr>
              </thead>

              <tbody class="ui-sortable">
                <tr v-for="agreement in agreements">
                  <td>
                    <strong>{{ agreement.agreementTitle }}</strong>
                  </td>
                  <td>
                    <span
                      v-if="agreement.isRequired"
                      class="c-label c-label--bad"
                    >Required</span>
                  </td>
                  <td class="icon">
                    <a
                      href="#"
                      role="button"
                      class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger"
                      rel="modal-confirm-delete"
                      @click="confirmDeleteAgreement(agreement)"
                    ><i
                      class="fa fa-trash"
                      aria-hidden="true"
                    />Delete</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- END table -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('agreements').then(function (response) {
        vue.agreements = response.data || []
      })
    })
  },
  data: function () {
    return {
      agreements: [],
      agreementToDelete: null,
      apiError: {}
    }
  },
  created: function () {
    const vue = this

    vue.emitter.off('deleteAgreement')
    vue.emitter.on('deleteAgreement', function () {
      vue.addModal('spinner')
      vue.$request.delete('agreements/' + vue.agreementToDelete.id).then(function (response) {
        vue.agreements = vue.agreements.filter(function (agreement) {
          return agreement.id !== vue.agreementToDelete.id
        })
        vue.removeModal('spinner')
      }).catch(function (err) {
        vue.removeModal('spinner')
        vue.apiError = err.response.data.errors
      })
    })
  },
  methods: {
    confirmDeleteAgreement: function (agreement) {
      const vue = this
      vue.agreementToDelete = agreement

      vue.addModal('confirm-delete', {
        modalTitle: 'Do you want to delete this agreement?',
        modalText: 'Deletion is permanent. Once an agreement is deleted, you will need to recreate it if you want it back.',
        callback: 'deleteAgreement',
        overlayClass: 'c-modal-overlay-warning',
        cancelText: 'No, Keep It',
        confirmText: 'Yes, Delete It'
      })
    }
  }
}
</script>
