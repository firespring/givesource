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
        v-for="adminUser in adminUsers"
        :key="adminUser.id"
        :admin-user="adminUser"
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
  props: {
    nonprofitId: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      adminUsers: [],
      loaded: false
    }
  },
  computed: {
    displayRows: function () {
      return this.loaded && this.adminUsers.length
    }
  },
  created: function () {
    const vue = this

    vue.$request.get('users').then(function (response) {
      vue.adminUsers = response.data
      vue.loaded = true
    })

    vue.bus.$on('deleteUserAdmin', function () {
      vue.removeUser()
    })

    vue.bus.$on('deleteUserAdminModal', function (selectedAdminUser) {
      vue.selectedAdminUser = selectedAdminUser
      vue.deleteModal(selectedAdminUser)
    })
  },
  beforeUnmount: function () {
    const vue = this
    vue.bus.$off('deleteUserAdmin')
    vue.bus.$off('deleteUserAdminModal')
  },
  methods: {
    deleteModal: function (selectedAdminUser) {
      const vue = this
      vue.addModal('confirm-delete', {
        modalTitle: 'Remove Admin User',
        modalText: 'Are you sure you want to remove ' + selectedAdminUser.email + ' ?',
        callback: 'deleteUserAdmin',
        overlayClass: 'c-modal-overlay-warning'
      })
    },
    removeUser: function () {
      const vue = this

      vue.addModal('spinner')
      vue.$request.delete('users/' + vue.selectedAdminUser.id).then(function () {
        vue.adminUsers = _.filter(vue.adminUsers, function (adminUser) {
          return adminUser.id !== vue.selectedAdminUser.id
        })
        vue.clearModals()
      }).catch(function (err) {
        vue.removeModal('spinner')
        vue.bus.$emit('has-error', err)
      })
    }
  }
}
</script>
