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
    ref="select"
    v-model="localValue"
    :name="name"
    :data-placeholder="placeholder"
    :class="{'has-error': hasError}"
    :required="isRequired"
    :aria-describedby="aria?.describedby"
    :aria-labelledby="aria?.labelledby"
  >
    <option
      v-if="placeholder"
      value=""
      disabled
    >
      {{ placeholder }}
    </option>
    <option
      v-else
      value=""
    />
    <option
      v-for="option in selectOptions"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script>

import { ref, computed, watch } from 'vue'

export default {
  props: {
    modelValue: { type: [String, Number], default: null },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Select a nonprofit'
    },
    nonprofits: {
      type: Array,
      default: () => {
        return []
      }
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    aria: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const localValue = ref('')
    const selectOptions = computed(() => {
      return props.nonprofits.map((nonprofit) => {
        return { label: nonprofit.legalName, value: nonprofit.id }
      })
    })

    watch(localValue, (newValue) => {
      emit('update:modelValue', newValue + '')
    })

    return {
      localValue,
      selectOptions
    }
  }
}
</script>
