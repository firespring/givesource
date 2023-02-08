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
    class="overlay"
    :style="{ 'z-index': zIndex }"
  >
    <nav class="overlay__nav">
      <router-link :to="{ name: 'homepage' }">
        Home
      </router-link>
      <router-link
        v-if="displayAbout"
        :to="{ name: 'about' }"
      >
        About
      </router-link>
      <router-link
        v-if="displayToolkits"
        :to="{ name: 'toolkits' }"
      >
        Toolkits
      </router-link>
      <router-link
        v-if="displayFAQ"
        :to="{ name: 'faq' }"
      >
        FAQ
      </router-link>
      <router-link :to="{ name: 'contact' }">
        Contact Us
      </router-link>
      <router-link
        v-if="displayCart"
        :to="{ name: 'cart' }"
      >
        Your Donations
      </router-link>

      <router-link
        v-for="page in pages"
        v-if="page.enabled"
        :key="page.uuid"
        :to="{ path: page.slug }"
      >
        {{ page.title }}
      </router-link>
    </nav>

    <a
      id="overlay__close"
      href="#"
      role="button"
      @click="close"
    ><i
      class="fas fa-times-circle"
      aria-hidden="true"
    /></a>
  </div>
</template>

<script>
export default {
  props: {
    data: {},
    zIndex: {
      type: [Number, String],
      default: 1000
    }
  },
  computed: {
    displayAbout: function () {
      return this.$store.getters.booleanSetting('PAGE_ABOUT_ENABLED')
    },
    displayFAQ: function () {
      return this.$store.getters.booleanSetting('PAGE_FAQ_ENABLED')
    },
    displayToolkits: function () {
      return this.$store.getters.booleanSetting('PAGE_TOOLKIT_ENABLED')
    },
    displayCart: function () {
      return this.$store.getters.cartItems.length > 0
    },
    pages: function () {
      return this.$store.getters.pages
    }
  },
  created: function () {
    this.addBodyClasses('has-overlay', 'has-overlay--mobile-nav')
  },
  methods: {
    close: function (event) {
      event.preventDefault()
      const vue = this

      vue.removeModal('menu-overlay')
      vue.removeBodyClasses('has-overlay', 'has-overlay--mobile-nav')
    }
  }
}
</script>
