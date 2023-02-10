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
  <table class="table-reorder table-headless">
    <draggable
      v-model="localContents"
      :options="draggableOptions"
      :element="'tbody'"
      class="ui-sortable"
      @end="updateSortOrder"
    >
      <faq-list-table-row
        v-for="content in localContents"
        :key="content.id"
        :content="content"
      />
    </draggable>
  </table>
</template>

<script>
import ComponentDraggable from 'vuedraggable'
import ComponentToolkitListTableRow from './ToolkitListTableRow.vue'

export default {
  components: {
    draggable: ComponentDraggable,
    'faq-list-table-row': ComponentToolkitListTableRow
  },
  props: {
    contents: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {
    return {
      localContents: [],

      // Sort Options
      draggableOptions: {
        handle: '.c-drag-handle',
        ghostClass: 'reorder-placeholder',
        draggable: 'tr'
      }
    }
  },
  watch: {
    contents: function (value) {
      this.localContents = value
    },
    localContents: function () {
      this.$emit('contents', this.localContents)
    }
  },
  methods: {
    updateSortOrder: function () {
      const vue = this

      const original = JSON.parse(JSON.stringify(vue.localContents))
      vue.localContents.forEach(function (content, i) {
        content.sortOrder = i
      })

      const toUpdate = _.differenceWith(vue.localContents, original, _.isEqual)
      vue.$request.patch('contents', {
        contents: toUpdate
      }).catch(function (err) {
        vue.$emit('hasError', err)
      })
    }
  }
}
</script>
