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
  <table class="table-middle table-reorder js-table-reorder">
    <thead>
      <tr>
        <th />
        <th class="u-width-100p">
          Sponsor Tier
        </th>
        <th />
      </tr>
    </thead>

    <draggable
      v-model="localSponsorTiers"
      v-bind="draggableOptions"
      tag="tbody"
      item-key="id"
      @end="updateSortOrder"
    >
      <template #item="{ element: sponsorTier }">
        <sponsors-list-table-row
          :key="sponsorTier.id"
          :sponsor-tier="sponsorTier"
          @delete-sponsor-tier="deleteSponsorTier"
          @has-error="hasError"
        />
      </template>
    </draggable>
  </table>
</template>

<script>
import draggable from 'vuedraggable'
import ComponentSponsorsTiersListTableRow from './SponsorsTiersListTableRow.vue'

export default {
  components: {
    draggable: draggable,
    'sponsors-list-table-row': ComponentSponsorsTiersListTableRow
  },
  props: {
    sponsorTiers: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  emits: ['sponsor-tiers', 'has-error'],
  data: function () {
    return {
      localSponsorTiers: [],

      // Sort Options
      draggableOptions: {
        handle: '.c-drag-handle',
        ghostClass: 'reorder-placeholder'
      },

      apiError: {}
    }
  },
  watch: {
    sponsorTiers: function (value) {
      this.localSponsorTiers = value
    },
    localSponsorTiers: function () {
      this.$emit('sponsor-tiers', this.localSponsorTiers)
    }
  },
  methods: {
    updateSortOrder: function () {
      const vue = this

      const original = JSON.parse(JSON.stringify(vue.localSponsorTiers))
      vue.localSponsorTiers.forEach(function (sponsorTier, i) {
        sponsorTier.sortOrder = i
      })

      const toUpdate = _.differenceWith(vue.localSponsorTiers, original, _.isEqual)
      vue.$request.patch('sponsor-tiers', {
        sponsorTiers: toUpdate
      }).catch(function (err) {
        vue.$emit('has-error', err)
      })
    },
    deleteSponsorTier: function (sponsorTierId) {
      const vue = this

      vue.localSponsorTiers = _.filter(vue.localSponsorTiers, function (sponsorTier) {
        return sponsorTier.id !== sponsorTierId
      })
    },
    hasError: function (err) {
      const vue = this
      vue.$emit('has-error', err)
    }
  }
}
</script>
