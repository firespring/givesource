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
  <div class="c-form-item__control">
    <input
      :id="id"
      ref="input"
      type="file"
      accept="image/*"
      :name="name"
      class="u-none"
      @change="onChange"
    >
    <button
      v-if="!hasFile"
      type="button"
      class="c-btn c-btn--good"
      @click.prevent="onTrigger"
    >
      Select Image
    </button>

    <div
      v-if="hasFile"
      class="c-form-item-grid c-selected-file c-selected-file--image"
    >
      <div
        v-if="fileUrl"
        class="c-selected-file__thumbnail c-form-item c-form-item--compact"
      >
        <img
          :alt="filename"
          :src="fileUrl"
        >
        <a
          :href="fileUrl"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
      <div class="c-selected-file__info c-form-item c-form-item--compact c-form-item--v-center">
        <div>
          <div class="c-selected-file-info">
            <a
              :href="fileUrl"
              target="_blank"
              rel="noopener noreferrer"
            >{{ filename }}</a>
          </div>

          <div class="c-selected-file-actions">
            <a
              href="#"
              class="c-btn c-btn--xs c-btn--flat c-btn--good js-modal-trigger"
              role="button"
              @click.prevent="onTrigger"
            >Select a New Image</a>
            <a
              href="#"
              class="c-btn c-btn--xs c-btn--flat c-btn--neutral"
              role="button"
              @click.prevent="removeFile"
            >Remove This Image</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    value: { type: [Object, File], default: () => null },
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: 800
    },
    extensions: {
      type: Array,
      default () {
        return ['gif', 'jpeg', 'jpg', 'png']
      }
    }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : null,
      fileUrl: false
    }
  },
  computed: {
    filename () {
      const vm = this
      if (vm.localValue && vm.localValue instanceof File) {
        return vm.localValue.name
      } else if (vm.localValue && vm.localValue.hasOwnProperty('filename')) {
        return vm.localValue.filename
      }
      return ''
    },
    hasFile () {
      const vm = this
      return (vm.localValue instanceof File || (_.isPlainObject(vm.localValue) && vm.localValue.hasOwnProperty('filename')))
    }
  },
  watch: {
    value (newVal) {
      this.localValue = newVal
    },
    localValue () {
      const vm = this

      if (_.isPlainObject(vm.localValue) && vm.localValue.hasOwnProperty('path')) {
        vm.fileUrl = vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.localValue.path
      } else if (vm.localValue instanceof File) {
        const reader = new FileReader()
        reader.onload = (e) => {
          vm.fileUrl = e.target.result
        }
        reader.readAsDataURL(vm.localValue)
      }

      vm.$emit('input', vm.localValue)
    }
  },
  created () {
    const vm = this

    vm.emitter.on('imageEditorSave', (original, blob) => {
      vm.localValue = vm.blobToFile(blob, original.name)
    })
  },
  beforeDestroy () {
    this.emitter.off('imageEditorSave')
  },
  methods: {
    onTrigger () {
      this.$refs.input.click()
    },
    onChange (event) {
      const vm = this

      const files = event.target.files || event.dataTransfer.files
      if (files.length && files[0] instanceof File && vm.extensions.indexOf(files[0].name.toLowerCase().split('.').pop()) > -1) {
        vm.addModal('photo-editor', {
          file: files[0],
          listener: 'imageEditorSave',
          height: vm.height,
          width: vm.width
        })
        vm.$refs.input.value = ''
        vm.addModal('spinner')
      } else {
        vm.addModal('error', {
          title: 'Invalid Image Type',
          message: 'The following image types are supported: ' + vm.extensions.join(', ')
        })
      }
    },
    removeFile () {
      const vm = this
      $(vm.$refs.input).val('')
      vm.localValue = null
    },
    blobToFile (blob, filename) {
      const date = new Date()
      blob.lastModifiedDate = date
      blob.lastModified = date.getTime()
      blob.name = filename
      Object.setPrototypeOf(blob, File.prototype)

      return blob
    }
  }
}
</script>
