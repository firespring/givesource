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
        <th>Logo</th>
        <th class="u-width-100p">
          Sponsor Name
        </th>
        <th />
      </tr>
    </thead>

    <draggable
      v-model="localSponsors"
      v-bind="draggableOptions"
      tag="tbody"
      item-key="id"
      @end="updateSortOrder"
    >
      <template #item="{ element: sponsor }">
        <sponsors-list-table-row
          :key="sponsor.id"
          :sponsor="sponsor"
          :file="getFile(sponsor.fileId)"
          @has-error="hasError"
          @delete-sponsor="deleteSponsor"
        />
      </template>
    </draggable>
  </table>
</template>

<script>
import draggable from 'vuedraggable'
import ComponentSponsorsListTableRow from './SponsorsListTableRow.vue'

export default {
  components: {
    draggable,
    'sponsors-list-table-row': ComponentSponsorsListTableRow
  },
  props: {
    files: {
      type: Array,
      default: function () {
        return []
      }
    },
    sponsors: {
      type: Array,
      default: function () {
        return []
      }
    },
    sponsorTierId: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['sponsors', 'has-error'],
  data: function () {
    return {
      localSponsors: [],

      // Sort Options
      draggableOptions: {
        handle: '.c-drag-handle',
        ghostClass: 'reorder-placeholder'
      }
    }
  },
  watch: {
    sponsors: function (value) {
      this.localSponsors = value
    },
    localSponsors: function () {
      this.$emit('sponsors', this.localSponsors)
    }
  },
  methods: {
    getFile: function (fileId) {
      return _.find(this.files, { id: fileId })
    },
    updateSortOrder: function () {
      const vue = this

      const original = JSON.parse(JSON.stringify(vue.localSponsors))
      vue.localSponsors.forEach(function (sponsor, i) {
        sponsor.sortOrder = i
      })

      const toUpdate = _.differenceWith(vue.localSponsors, original, _.isEqual)
      vue.$request.patch('sponsor-tiers/' + vue.sponsorTierId + '/sponsors', {
        sponsors: toUpdate
      }).catch(function (err) {
        vue.$emit('has-error', err)
      })
    },
    deleteSponsor: function (sponsorId) {
      const vue = this

      vue.localSponsors = _.filter(vue.localSponsors, function (sponsor) {
        return sponsor.id !== sponsorId
      })
    },
    hasError: function (err) {
      const vue = this
      vue.$emit('has-error', err)
    }
  }
}
</script>
