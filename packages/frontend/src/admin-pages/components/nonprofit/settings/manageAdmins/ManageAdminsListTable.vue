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
  <table
    class="table-middle"
    :class="{ 'table-empty': !displayRows }"
  >
    <thead>
      <tr>
        <th class="icon">
          <i
            class="fa fa-picture-o"
            aria-hidden="true"
          />
        </th>
        <th class="u-width-100p">
          Name
        </th>
        <th>Added</th>
        <th />
      </tr>
    </thead>

    <tbody v-if="displayRows">
      <manage-admins-list-table-row
        v-for="nonprofitUser in nonprofitUsers"
        :key="nonprofitUser.id"
        :nonprofit-user="nonprofitUser"
      />
    </tbody>

    <tbody v-else>
      <layout-empty-table-row
        :loaded="loaded"
        :colspan="5"
        message="There are no users."
      />
    </tbody>
  </table>
</template>

<script>
import ComponentEmptyTableRow from './../../../layout/EmptyTableRow.vue'
import ComponentManageAdminsListTableRow from './ManageAdminsListTableRow.vue'

export default {
  components: {
    'layout-empty-table-row': ComponentEmptyTableRow,
    'manage-admins-list-table-row': ComponentManageAdminsListTableRow
  },
  props: [
    'nonprofitId'
  ],
  data: function () {
    return {
      nonprofitUsers: [],
      loaded: false
    }
  },
  computed: {
    displayRows: function () {
      return this.loaded && this.nonprofitUsers.length
    }
  },
  created: function () {
    const vue = this

    vue.$request.get('nonprofits/' + vue.nonprofitId + '/users').then(function (response) {
      vue.nonprofitUsers = response.data
      vue.loaded = true
    })

    vue.bus.$on('deleteUserNonprofit', function () {
      vue.removeUser()
    })

    vue.bus.$on('deleteUserNonprofitModal', function (selectedNonprofitUser) {
      vue.selectedNonprofitUser = selectedNonprofitUser
      vue.deleteModal(selectedNonprofitUser)
    })
  },
  beforeDestroy: function () {
    const vue = this
    vue.bus.$off('deleteUserNonprofit')
    vue.bus.$off('deleteUserNonprofitModal')
  },
  methods: {
    deleteModal: function (selectedNonprofitUser) {
      const vue = this
      vue.addModal('confirm-delete', {
        modalTitle: 'Remove Nonprofit User',
        modalText: 'Are you sure you want to remove ' + selectedNonprofitUser.email + ' ?',
        callback: 'deleteUserNonprofit',
        overlayClass: 'c-modal-overlay-warning'
      })
    },
    removeUser: function () {
      const vue = this

      vue.addModal('spinner')
      vue.$request.delete('nonprofits/' + vue.selectedNonprofitUser.nonprofitId + '/users/' + vue.selectedNonprofitUser.id).then(function () {
        vue.nonprofitUsers = _.filter(vue.nonprofitUsers, function (nonprofitUser) {
          return nonprofitUser.id !== vue.selectedNonprofitUser.id
        })
        vue.clearModals()
      }).catch(function (err) {
        vue.clearModals()
        vue.$emit('hasError', err)
      })
    }
  }
}
</script>
