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
      :disabled="!allowEmpty"
      :value="0"
    >
      No category selected
    </option>
    <option disabled>
      -----
    </option>
    <option
      v-for="option in formOptions"
      :value="option.value"
      :disabled="option.disabled"
      v-html="option.text"
    />
  </select>
</template>

<script>
export default {
  props: {
    value: { type: [String, Number], default: null },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    allowEmpty: {
      type: Boolean,
      default: false
    },
    options: {
      type: [Object, Array],
      default: function () {
        return [
          { value: 1, text: 'Animal-Related' },
          { value: 2, text: 'Arts, Culture & Humanities' },
          { value: 3, text: 'Children & Families' },
          { value: 4, text: 'Civil Rights, Social Action & Advocacy' },
          { value: 5, text: 'Community Improvement & Capacity Building' },
          { value: 6, text: 'Crime & Legal-Related' },
          { value: 7, text: 'Diseases, Disorders & Medical Disciplines' },
          { value: 8, text: 'Education-Early Childhood' },
          { value: 9, text: 'Education-Higher Education' },
          { value: 10, text: 'Education-K-12' },
          { value: 11, text: 'Environment' },
          { value: 12, text: 'Food, Agriculture & Nutrition' },
          { value: 13, text: 'Health Care' },
          { value: 14, text: 'Housing & Shelter' },
          { value: 15, text: 'Human Services' },
          { value: 16, text: 'International, Foreign Affairs & National Security' },
          { value: 17, text: 'Library & Literacy Programs' },
          { value: 18, text: 'Medical Research' },
          { value: 19, text: 'Mental Health & Crisis Intervention' },
          { value: 20, text: 'Mutual & Membership Benefit' },
          { value: 21, text: 'Older Adults' },
          { value: 22, text: 'Philanthropy, Voluntarism & Grantmaking Foundations' },
          { value: 23, text: 'Politics & Public Administration' },
          { value: 24, text: 'Public & Societal Benefit' },
          { value: 25, text: 'Public Safety, Disaster Preparedness & Relief' },
          { value: 26, text: 'Recreation & Sports' },
          { value: 27, text: 'Religion-Related' },
          { value: 28, text: 'Science & Technology' },
          { value: 29, text: 'Veterans Support' },
          { value: 30, text: 'Women' },
          { value: 31, text: 'Youth Development' }
        ]
      }
    }
  },
  data: function () {
    return {
      localValue: this.value || 0
    }
  },
  computed: {
    formOptions: function () {
      const vue = this
      return Object.keys(vue.options).map(function (value) {
        let option = vue.options[value] || {}
        if (typeof option !== 'object') {
          option = { text: option }
        }
        option.value = option.value || value
        option.text = option.text || value
        return option
      })
    },
    selectedValue: function () {
      const vue = this
      return vue.localValue
    }
  },
  watch: {
    localValue: function (value, oldValue) {
      const vue = this

      if (value === oldValue) {
        return
      }
      vue.bus.$emit('input', vue.selectedValue)
    },
    value: function (value, oldValue) {
      const vue = this

      if (value === oldValue) {
        return
      }
      vue.localValue = value
    }
  }
}
</script>
