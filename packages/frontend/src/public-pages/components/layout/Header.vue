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
  <header class="page-header flex text-c">
    <div class="page-header__logo flex justify-center items-center">
      <a
        href="/"
        title="Return to the homepage"
      ><img
        :alt="logoTitle"
        :src="logoUrl"
      ></a>
    </div>

    <nav class="page-header__nav-menu items-center">
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

      <router-link
        v-for="page in enabledPages"
        :key="page.id"
        :to="{ path: page.slug }"
      >
        {{ page.title }}
      </router-link>
    </nav>

    <form
      class="page-header__search flex justify-center items-center"
      @submit.prevent="submit"
    >
      <label
        class="u-hidden-visually"
        for="searchNonprofits"
      >Find a Nonprofit</label>
      <input
        id="searchNonprofits"
        ref="search"
        v-model="formData.search"
        type="search"
        name="searchNonprofits"
        placeholder="Find a Nonprofit"
      >
      <div
        v-if="formErrors.search"
        class="notes notes--below notes--error"
      >
        {{ formErrors.search }}
      </div>
    </form>

    <div
      v-if="canDonate"
      class="page-header__cart items-center"
    >
      <router-link
        :to="{ name: 'cart' }"
        title="View your current donations"
      >
        <span
          ref="shoppingCart"
          class="fa-layers fa-fw"
        >
          <i class="fas fa-shopping-cart" />
          <span
            class="fa-layers-text fa-inverse"
            data-fa-transform="right-4 up-6"
          >{{ cartItems.length }}</span>
        </span>
        <span class="u-hidden-visually">{{ cartItems.length }} items in cart</span>
      </router-link>
    </div>

    <a
      id="mobile-nav-trigger"
      href="#"
      class="page-header__nav-toggle items-center"
      @click.prevent="openMenu"
    ><i
      class="fas fa-bars"
      aria-hidden="true"
    /><span>Menu</span></a>
  </header>
</template>

<script>
import * as Settings from './../../helpers/settings'
import { mapState } from 'pinia'
import { useAppStore } from "../../store"

export default {
  data () {
    return {
      // Form Data
      formData: {
        search: ''
      },

      // Errors
      formErrors: {}
    }
  },
  computed: {
    ...mapState(useAppStore, {
      cartItems: state => state.cartItems
    }),
    canDonate () {
      return Settings.isDuringDonations() || Settings.isDuringEvent()
    },
    displayAbout () {
      return this.$store.booleanSetting('PAGE_ABOUT_ENABLED')
    },
    displayFAQ () {
      return this.$store.booleanSetting('PAGE_FAQ_ENABLED')
    },
    displayToolkits () {
      return this.$store.booleanSetting('PAGE_TOOLKIT_ENABLED')
    },
    logoTitle () {
      return Settings.eventTitle() + ' Logo'
    },
    logoUrl () {
      const eventLogo = this.$store.setting('EVENT_LOGO')
      return eventLogo || require('../../assets/img/logo-event.png')
    },
    enabledPages: function () {
      return (this.pages || []).filter(page => page.enabled)
    },
    pages () {
      return this.$store.pages
    }
  },
  watch: {
    cartItems () {
      $(this.$refs.shoppingCart).find('span.fa-layers-text').text(this.cartItems.length)
    },
    formData: {
      handler () {
        const vm = this
        if (Object.keys(vm.formErrors).length) {
          vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
        }
      },
      deep: true
    }
  },
  beforeMount () {
    this.$store = useAppStore()
  },
  created () {
    const vm = this

    vm.bus.$on('navigate', () => {
      vm.formData.search = ''
    })
  },
  beforeUnmount () {
    const vm = this

    vm.bus.$off('navigate')
  },
  methods: {
    getConstraints () {
      return {
        search: {
          presence: false,
          length: {
            minimum: 3
          }
        }
      }
    },
    submit () {
      const vm = this

      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      if (!Object.keys(vm.formErrors).length) {
        vm.searchNonprofits()
      }
    },
    searchNonprofits () {
      const vm = this

      vm.$router.push(vm.generatePageLink({ search: vm.formData.search, start: null }))
    },
    openMenu () {
      this.addModal('menu-overlay')
    },
    generatePageLink (query) {
      const vm = this

      query = query || {}
      query = _.extend({}, vm.$route.query, query)
      Object.keys(query).forEach(key => {
        if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
          delete query[key]
        }
      })
      return {
        name: 'search-results',
        query: query
      }
    }
  }
}
</script>
