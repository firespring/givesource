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
  <div
    class="page-hero"
    :style="mastheadStyle"
    role="region"
    aria-label="Introduction"
  >
    <div
      v-if="hasSpotlightSlot"
      class="page-hero__spotlight"
    >
      <slot name="spotlight" />
    </div>

    <div
      class="page-hero__title"
      :class="{ wrapper: wrap, 'wrapper--sm': wrap }"
    >
      <slot name="logo" />
      <slot name="title" />
    </div>

    <div
      v-if="hasMessageSlot"
      class="page-hero__message"
    >
      <slot />
    </div>

    <div
      v-if="presentedBy && foundationLogoUrl"
      class="presented-by"
    >
      <div class="items-center">
        Presented by
        <div class="presented-by__logo">
          <a
            v-if="foundationUrl"
            :href="foundationUrl"
            target="_blank"
            rel="noopener noreferrer"
          ><img
            alt="Foundation Logo"
            :src="foundationLogoUrl"
          ></a>
          <img
            v-else
            alt="Foundation Logo"
            :src="foundationLogoUrl"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    presentedBy: {
      type: Boolean,
      default: false
    },
    wrap: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    mastheadStyle: function () {
      const vue = this
      return {
        'background-image': 'url(' + vue.backgroundImageUrl + ')'
      }
    },
    backgroundImageUrl: function () {
      const vue = this
      return vue.$store.getters.setting('MASTHEAD_IMAGE') ? vue.$store.getters.setting('MASTHEAD_IMAGE') : require('../../assets/img/hero.jpg')
    },
    hasSpotlightSlot: function () {
      return this.$slots.spotlight
    },
    hasMessageSlot: function () {
      return this.$slots.default
    },
    foundationLogoUrl: function () {
      const vue = this
      return vue.$store.getters.setting('FOUNDATION_LOGO') ? vue.$store.getters.setting('FOUNDATION_LOGO') : false
    },
    foundationUrl: function () {
      const vue = this
      return vue.$store.getters.setting('FOUNDATION_URL') ? vue.$store.getters.setting('FOUNDATION_URL') : false
    }
  }
}
</script>
