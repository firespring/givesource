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
      <div class="c-drag-handle ui-sortable-handle" />
    </td>

    <td class="image u-text-c">
      <img
        v-if="logoUrl"
        alt=""
        :src="logoUrl"
      >
    </td>

    <td>
      <strong>
        <router-link :to="{ name: 'sponsors-edit', params: {sponsorTierId: sponsor.sponsorTierId, sponsorId: sponsor.id} }">{{ sponsor.name }}</router-link>
      </strong>
    </td>

    <td class="icon">
      <a
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger"
        rel="modal-confirm-delete"
        @click="deleteSponsor"
      >
        <i
          class="fa fa-trash"
          aria-hidden="true"
        />Delete
      </a>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
    sponsor: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  emits: ['delete-sponsor', 'has-error'],
  computed: {
    logoUrl: function () {
      return this.file.hasOwnProperty('path') ? this.$store.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + this.file.path : false
    }
  },
  methods: {
    deleteSponsor: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('spinner')
      let promise = Promise.resolve()
      if (vue.sponsor.hasOwnProperty('fileId') && vue.sponsor.fileId) {
        promise = vue.$request.delete('files/' + vue.sponsor.fileId)
      }

      promise.then(function () {
        return vue.$request.delete('sponsor-tiers/' + vue.sponsor.sponsorTierId + '/sponsors/' + vue.sponsor.id)
      }).then(function () {
        vue.clearModals()
        vue.$emit('delete-sponsor', vue.sponsor.id)
      }).catch(function (err) {
        vue.clearModals()
        vue.$emit('has-error', err)
      })
    }
  }
}
</script>
