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
  <div>
    <layout-header />

    <layout-hero>
      <template #title>
        <h1>
          {{ page.title }}
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <div
        class="wrapper wrapper--sm"
        v-html="page.text"
      />
    </main>

    <layout-footer>
      <layout-sponsors />
    </layout-footer>
  </div>
</template>

<script>
import * as Settings from './../../helpers/settings'
import ComponentFooter from './../layout/Footer.vue'
import ComponentHeader from './../layout/Header.vue'
import ComponentHero from './../layout/Hero.vue'
import ComponentSponsors from './../layout/Sponsors.vue'

export default {
  components: {
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero,
    'layout-sponsors': ComponentSponsors
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.page = to.meta.page

      vm.setBodyClasses('page')
      vm.setPageTitle(vm.eventTitle + ' - ' + vm.page.title)
    })
  },
  beforeRouteUpdate (to, from, next) {
    const vm = this

    const pages = vm.$store.getters.pages
    const slug = to.path

    let matched = null
    pages.forEach((page) => {
      if (slug === '/' + page.slug) {
        matched = page
      }
    })

    if (matched && matched.enabled) {
      vm.page = matched
      next()
    } else {
      next({ name: '404' })
    }
  },
  data: function () {
    return {
      page: {}
    }
  },
  computed: {
    eventTitle () {
      return Settings.eventTitle()
    }
  }
}
</script>
