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
  <tr>
    <td class="icon">
      <div class="c-drag-handle" />
    </td>
    <td class="icon">
      <i
        class="fa"
        :class="iconClass"
        aria-hidden="true"
      />
    </td>
    <td class="u-width-100p">
      <strong><a
        href="#"
        @click="editResource"
      >{{ title }}</a></strong>
    </td>
    <td class="icon">
      <a
        href="#"
        role="button"
        class="icon icon--bad"
        @click="deleteResource"
      ><i
        class="fa fa-minus-circle"
        aria-hidden="true"
      /></a>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    title: function () {
      if (this.content.hasOwnProperty('value')) {
        const title = _.find(this.content.value, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_TITLE' })
        if (title) {
          return title.value
        }
      }
      return null
    },
    iconClass: function () {
      if (this.content.hasOwnProperty('value')) {
        const type = _.find(this.content.value, { key: 'TOOLKIT_RESOURCE_LIST_ITEM_TYPE' })
        if (type) {
          return type.value === 'FILE' ? 'fa-file' : 'fa-link'
        }
      }
      return 'fa-file'
    }
  },
  methods: {
    editResource: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('pages-toolkit-edit-resource-modal', { content: vue.content })
    },
    deleteResource: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('pages-toolkit-delete-resource-modal', { content: vue.content })
    }
  }
}
</script>
