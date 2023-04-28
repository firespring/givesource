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
      v-if="placeholder"
      disabled
      value=""
    >
      {{ placeholder }}
    </option>
    <option
      v-if="placeholder"
      disabled
      value=""
    >
      -----
    </option>
    <option
      v-for="sponsorTier in sponsorTiers"
      :value="sponsorTier.id"
    >
      {{ sponsorTier.name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    id: { type: [String, Number], default: null },
    name: { type: String, default: null },
    placeholder: { type: String, default: null },
    sponsorTiers: {
      type: Array,
      default: function () {
        return []
      }
    },
    value: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : ''
    }
  },
  watch: {
    value: function (newVal) {
      this.localValue = newVal
    },
    localValue: function () {
      this.$emit('input', this.localValue)
    }
  }
}
</script>
