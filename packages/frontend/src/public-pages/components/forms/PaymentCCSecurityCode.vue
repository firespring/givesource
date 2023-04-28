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
    v-if="isMobile"
    :id="id"
    ref="input"
    v-model="localValue"
    type="tel"
    :name="name"
    autocomplete="off"
    placeholder="••••"
    :class="{'has-error': hasError}"
  >
  <input
    v-else
    :id="id"
    ref="input"
    v-model="localValue"
    type="text"
    :name="name"
    autocomplete="off"
    placeholder="••••"
    :class="{'has-error': hasError}"
  >
</template>

<script>
require('jquery.payment')

export default {
  props: {
    value: { type: String, default: '' },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : null
    }
  },
  computed: {
    isMobile: function () {
      return /Mobi/.test(navigator.userAgent)
    }
  },
  watch: {
    value: function (newVal) {
      this.localValue = newVal
    },
    localValue: function () {
      this.$emit('input', this.localValue)
    }
  },
  mounted: function () {
    const vue = this
    $(vue.$refs.input).payment('formatCardCVC')
  }
}
</script>
