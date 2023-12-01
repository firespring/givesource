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
  <input
    v-if="isDesktop"
    :id="id"
    ref="input"
    v-model="localValue"
    type="text"
    :name="name"
  >
  <input
    v-else
    :id="id"
    v-model="localValue"
    type="color"
    :name="name"
  >
</template>

<script>
require('@claviska/jquery-minicolors')

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: String, default: null },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    defaultColor: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      localValue: ''
    }
  },
  computed: {
    isDesktop: function () {
      return !/Mobi/.test(navigator.userAgent)
    }
  },
  watch: {
    localValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.$emit('update:modelValue', value)
      }
    },
    modelValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.localValue = value
        $(vue.$refs.input).minicolors('value', vue.modelValue)
      }
    }
  },
  mounted: function () {
    const vue = this

    if (vue.isDesktop) {
      const options = {
        change: function (value) {
          vue.localValue = value
        }
      }
      if (vue.defaultColor) {
        options.defaultValue = vue.defaultColor
      }
      $(vue.$refs.input).minicolors(options)
    }
  }
}
</script>
