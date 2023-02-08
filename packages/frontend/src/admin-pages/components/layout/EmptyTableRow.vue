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
    <td
      v-if="loaded"
      :colspan="colspan"
      class="u-text-c"
    >
      <p>{{ message }}</p>
      <p v-if="displayButton">
        <router-link
          :to="buttonLink"
          class="c-btn c-btn--sm"
        >
          {{ buttonText }}
        </router-link>
      </p>
    </td>
    <td
      v-else
      :colspan="colspan"
      class="u-text-c"
    >
      <layout-spinner />
    </td>
  </tr>
</template>

<script>
import ComponentSpinner from './Spinner.vue'

export default {
  components: {
    'layout-spinner': ComponentSpinner
  },
  props: {
    colspan: {
      type: [String, Number],
      default: null
    },
    loaded: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'This table is empty.'
    },
    buttonText: {
      type: String,
      default: null
    },
    buttonLink: {
      type: Object,
      default: null
    }
  },
  computed: {
    displayButton: function () {
      return this.buttonText && this.buttonLink
    }
  }
}
</script>
