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
    <navigation></navigation>
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">

        <div class="o-page-header">
          <div class="o-page-header__text">
            <nav class="o-page-header-nav c-breadcrumb">
              <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
            </nav>
            <h1 class="o-page-header-title">Event Agreements</h1>
          </div>
        </div>

        <div class="o-app-main-content">
          <api-error v-model="apiError"></api-error>

<!--    begin main content      -->


          <!-- BEGIN header actions -->
          <div class="c-header-actions">

            <div>
              <router-link :to="{ name: 'settings-add-agreement' }" class="c-btn c-btn--sm c-btn--icon" role="button">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Agreement
              </router-link>
            </div>

          </div>
          <!-- END header actions -->

          <div><!-- todo? was form tag -->

            <!-- BEGIN table -->
            <table class="table-middle table-reorder js-table-reorder">
              <thead>
              <tr>
                <th class="u-width-100p">Title</th>
                <th></th>
              </tr>
              </thead>

              <tbody class="ui-sortable">
              <tr v-for="agreement in agreements">
                <td>
                  <strong>{{ agreement.agreementTitle }}</strong>
                </td>
                <td class="icon">
                  <a href="#" @click="confirmDeleteAgreement(agreement)" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger" rel="modal-confirm-delete"
                  ><i class="fa fa-trash" aria-hidden="true"></i>Delete</a>
                </td>
              </tr>
              </tbody>
            </table>
            <!-- END table -->

          </div>


          <!--    end main-content      -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// import * as Utils from './../../../../helpers/utils';
// import ComponentDatetime from './../../../forms/Datetime.vue';
// import ComponentSelectTimeZone from './../../../forms/SelectTimeZone.vue';

export default {
  data: function () {
    return {
      agreements: [],
      agreementToDelete: null,
      apiError: {},
    };
  },
  computed: {
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('agreements').then(function (response) {
        console.log('get agreements', response)
        vue.agreements = response.data || [];
      });
    });
  },
  methods: {
    confirmDeleteAgreement: function(agreement) {
      const vue = this;
      vue.agreementToDelete = agreement;

      vue.addModal('confirm-delete', {
        modalTitle: 'Do you want to delete the selected item(s)?',
        modalText: 'Proactively harness backward-compatible best practices through enterprise technology. Objectively maximize leveraged catalysts for change with goal-oriented core competencies. Progressively exploit superior technology with end-to-end communities.',
        callback: 'deleteAgreement',
      });
    },
  },
  created: function () {
    const vue = this;

    vue.bus.$on('deleteAgreement', function () {
      vue.addModal('spinner');
      vue.$request.delete('agreements/'+vue.agreementToDelete.id).then(function(response){
        console.log('agreement deleted', { agreement: vue.agreementToDelete, response: response });
        vue.agreements = vue.agreements.filter(function (agreement) {
          return agreement.id !== vue.agreementToDelete.id;
        })
        vue.removeModal('spinner');
      }).catch(function (err) {
        vue.removeModal('spinner');
        vue.apiError = err.response.data.errors;
      });
    });
  },
  // components: {
  //   'forms-datetime': ComponentDatetime,
  //   'forms-select-time-zone': ComponentSelectTimeZone,
  // }
};
</script>