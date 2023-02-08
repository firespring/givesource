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
  <button
    type="submit"
    class="btn"
    :class="buttonClasses"
    :disabled="processing"
  >
    <slot>Submit</slot>
  </button>
</template>

<script>
export default {
  props: {
    processing: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'accent'
    },
    size: {
      type: String,
      default: ''
    },
    rounded: {
      type: Boolean,
      default: true
    },
    hasIcon: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      classes: {
        // Color
        'btn--accent': this.color.toLowerCase() === 'accent',
        'btn--blue': this.color.toLowerCase() === 'blue',
        'btn--dark': this.color.toLowerCase() === 'dark',
        'btn--green': this.color.toLowerCase() === 'green',
        'btn--lite': this.color.toLowerCase() === 'lite',
        'btn--red': this.color.toLowerCase() === 'red',
        'btn--reverse': this.color.toLowerCase() === 'reverse',

        // Has Icon
        'btn--icon': this.hasIcon,

        // Rounded
        'btn--round': this.rounded,

        // Size
        'btn--xs': this.size.toLowerCase() === 'xs',
        'btn--sm': this.size.toLowerCase() === 'sm',
        'btn--lg': this.size.toLowerCase() === 'lg'
      }
    }
  },
  computed: {
    buttonClasses: function () {
      return _.extend({}, this.classes, { 'btn--loading': this.processing })
    }
  }
}
</script>
