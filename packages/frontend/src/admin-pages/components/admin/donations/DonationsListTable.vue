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
  <table :class="{ 'table-empty': !displayRows }">
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>$</th>
        <th class="u-width-25p">
          Nonprofit
        </th>
        <th class="u-width-25p">
          Donor
        </th>
        <th class="u-width-25p">
          Contact Info
        </th>
        <th class="u-width-25p">
          Billing Address
        </th>
      </tr>
    </thead>

    <tbody v-if="displayRows">
      <donations-list-table-row
        v-for="donation in donations"
        :key="donation.id"
        :donation="donation"
      />
    </tbody>

    <tbody v-else>
      <layout-empty-table-row
        :loaded="loaded"
        :colspan="7"
        message="There are no donations."
      />
    </tbody>
  </table>
</template>

<script>
import ComponentDonationsListTableRow from './DonationsListTableRow.vue'
import ComponentEmptyListTableRow from './../../layout/EmptyTableRow.vue'

export default {
  components: {
    'donations-list-table-row': ComponentDonationsListTableRow,
    'layout-empty-table-row': ComponentEmptyListTableRow
  },
  props: {
    donations: {
      type: Array,
      default: function () {
        return []
      }
    },
    loaded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayRows: function () {
      return this.loaded && this.donations.length
    }
  }
}
</script>
