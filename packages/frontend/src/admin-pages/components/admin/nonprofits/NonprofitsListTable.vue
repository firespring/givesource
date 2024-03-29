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
        <th class="u-width-99p u-nowrap">
          Name
        </th>
        <th class="u-nowrap">
          Registered
        </th>
        <th class="u-nowrap">
          $ Raised
        </th>
        <th />
      </tr>
    </thead>

    <tbody v-if="displayRows">
      <nonprofits-list-table-row
        v-for="nonprofit in nonprofits"
        :key="nonprofit.id"
        :nonprofit="nonprofit"
        @update-nonprofit="updateNonprofit"
        @has-error="hasError"
      />
    </tbody>

    <tbody v-else>
      <layout-empty-table-row
        :loaded="loaded"
        :colspan="6"
        message="There are no nonprofits."
      />
    </tbody>
  </table>
</template>

<script>
import ComponentEmptyTableRow from './../../layout/EmptyTableRow.vue'
import ComponentNonprofitListTableRow from './NonprofitsListTableRow.vue'

export default {
  components: {
    'layout-empty-table-row': ComponentEmptyTableRow,
    'nonprofits-list-table-row': ComponentNonprofitListTableRow
  },
  props: {
    nonprofits: {
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
  emits: ['update-nonprofit', 'has-error'],
  computed: {
    displayRows: function () {
      return this.loaded && this.nonprofits.length
    }
  },
  methods: {
    updateNonprofit: function (nonprofitId) {
      const vue = this
      vue.$emit('update-nonprofit', nonprofitId)
    },

    hasError: function (err) {
      const vue = this
      vue.$emit('has-error', err)
    }
  }
}
</script>
