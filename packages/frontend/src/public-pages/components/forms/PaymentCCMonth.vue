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
      v-for="month in options"
      :value="month"
    >
      {{ month }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    value: {},
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : '01',
      options: [
                	'01',
        '02',
        '03',
	                '04',
	                '05',
	                '06',
	                '07',
	                '08',
	                '09',
	                '10',
	                '11',
	                '12'
      ]
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
    this.$emit('input', this.localValue)
  }
}
</script>
