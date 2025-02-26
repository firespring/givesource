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

    <layout-hero :presented-by="true">
      <template #title>
        <h1>
          Sitemap
        </h1>
      </template>
    </layout-hero>

    <main
      id="main-content"
      class="main"
    >
      <div class="wrapper wrapper--sm">
        <ul>
          <li
            v-for="(route) in sitemapRoutes"
            :key="route.name+ '-link'"
          >
            <router-link :to="route.path">
              {{ route.name.charAt(0).toUpperCase() + route.name.slice(1) }}
            </router-link>
          </li>
          <li
            v-for="(page) in enabledPages"
            :key="page.uuid"
          >
            <router-link
              :to="{ path: page.slug }"
            >
              {{ page.title }}
            </router-link>
          </li>
        </ul>
      </div>
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
  data: function () {
    return {
      sitemapRoutes: [],
      enabledPages: []
    }
  },
  computed: {
    eventTitle: function () {
      return Settings.eventTitle()
    }
  },
  beforeMount: function () {
    this.sitemapRoutes = this.$router.getRoutes().filter((route) => {
      return route.meta.inSitemap
    })
    this.enabledPages = (this.$store.getters.pages || []).filter(page => page.enabled && page.enabled !== '0')

    this.setBodyClasses('page')
    this.setPageTitle(this.eventTitle + ' - Sitemap')
  },
  methods: {
    getContentValue: function (content, contentKey) {
      const item = _.find(content.value, { key: contentKey })
      return item ? item.value : null
    }
  }
}
</script>
