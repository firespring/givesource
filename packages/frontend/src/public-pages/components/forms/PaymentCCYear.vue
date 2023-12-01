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
  <select
    :id="id"
    ref="input"
    v-model="localValue"
    :name="name"
  >
    <option
      v-for="year in range"
      :value="year"
    >
      {{ year }}
    </option>
  </select>
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: [String, Number], default: '' },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    years: {
      type: Number,
      default: 10
    }
  },
  data: function () {
    return {
      localValue: this.modelValue ? this.modelValue : new Date().getFullYear()
    }
  },
  computed: {
    range: function () {
      const range = []
      let year = new Date().getFullYear()
      for (let i = 0; i < this.years; i++) {
        range.push(year)
        year += 1
      }
      return range
    }
  },
  watch: {
    modelValue: {
      handler (newVal) {
        this.localValue = newVal
      }
    },
    localValue: {
      handler () {
        this.$emit('update:modelValue', this.localValue)
      }
    }
  },
  mounted: function () {
    this.$emit('update:modelValue', this.localValue)
  }
}
</script>
