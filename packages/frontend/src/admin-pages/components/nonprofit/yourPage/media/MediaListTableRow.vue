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
    <td class="icon">
      <i
        class="fa"
        :class="icon"
        aria-hidden="true"
      />
    </td>
    <td class="image u-text-c">
      <img
        :src="imageSrc"
        :alt="caption"
      >
    </td>
    <td>
      <strong>
        <router-link :to="{ name: editLink, params: { slideId: slide.id } }">{{ caption }}</router-link>
      </strong>
    </td>
    <td class="icon">
      <a
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger"
        rel="modal-confirm-delete"
        @click="deleteSlide"
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
import Media from './../../../../helpers/media'

export default {
  props: {
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
    slide: { type: Object, default: () => ({}) }
  },
  emits: ['delete-slide'],
  computed: {
    icon: function () {
      const vue = this

      switch (vue.slide.type) {
        case Media.TYPE_VIMEO:
          return 'fa-vimeo-square'
        case Media.TYPE_YOUTUBE:
          return 'fa-youtube-square'
        case Media.TYPE_IMAGE:
        default:
          return 'fa-picture-o'
      }
    },
    editLink: function () {
      const vue = this

      switch (vue.slide.type) {
        case Media.TYPE_VIMEO:
        case Media.TYPE_YOUTUBE:
          return 'nonprofit-your-page-media-videos-edit'
        case Media.TYPE_IMAGE:
        default:
          return 'nonprofit-your-page-media-photos-edit'
      }
    },
    caption: function () {
      const vue = this

      switch (vue.slide.type) {
        case Media.TYPE_VIMEO:
        case Media.TYPE_YOUTUBE:
          return vue.slide.caption || vue.slide.url
        case Media.TYPE_IMAGE:
        default:
          return vue.slide.caption || vue.file.filename
      }
    },
    imageSrc: function () {
      const vue = this

      switch (vue.slide.type) {
        case Media.TYPE_VIMEO:
        case Media.TYPE_YOUTUBE:
          return vue.slide.thumbnail
        case Media.TYPE_IMAGE:
        default:
          return vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.file.path
      }
    }
  },
  methods: {
    deleteSlide: function (event) {
      event.preventDefault()
      const vue = this

      vue.$emit('delete-slide', vue.slide)
    }
  }
}
</script>
