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
      :name="name"
      class="u-none"
      @change="onChange"
    >
    <button
      id="uploadTrigger"
      type="button"
      class="c-btn c-btn--good"
      @click="onTrigger"
    >
      Select File
    </button>
    <div
      id="fileNames"
      class="filenames"
    >
      {{ filename }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    value: { type: Object, default: () => null }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : {}
    }
  },
  computed: {
    filename: function () {
      if (this.localValue && this.localValue instanceof File) {
        return this.localValue.name
      } else if (this.localValue && this.localValue.hasOwnProperty('filename')) {
        return this.localValue.filename
      } else if (this.placeholder) {
        return this.placeholder
      }
      return ''
    }
  },
  watch: {
    value: function (newVal) {
      this.localValue = newVal
    },
    localValue: function () {
      this.bus.$emit('input', this.localValue)
    }
  },
  methods: {
    onTrigger: function (event) {
      event.preventDefault()
      const vue = this

      vue.$refs.input.click()
    },
    onChange: function (event) {
      const vue = this

      const files = event.target.files || event.dataTransfer.files
      if (files.length) {
        vue.localValue = files[0]
      }
    }
  }
}
</script>
