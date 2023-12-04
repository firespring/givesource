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

    <layout-hero :presented-by="false">
      <template #title>
        <h1>
          Oops!
        </h1>
      </template>
    </layout-hero>

    <main class="main">
      <div class="wrapper wrapper--sm text-c">
        <h2>Page Not Found.</h2>
        <p>
          <a href="/">Return to the homepage</a>
        </p>
      </div>
    </main>

    <layout-footer />
  </div>
</template>

<script>
import * as Settings from './../../helpers/settings'
import ComponentFooter from './../layout/Footer.vue'
import ComponentHeader from './../layout/Header.vue'
import ComponentHero from './../layout/Hero.vue'

export default {
  components: {
    'layout-footer': ComponentFooter,
    'layout-header': ComponentHeader,
    'layout-hero': ComponentHero
  },
  computed: {
    eventTitle: function () {
      return Settings.eventTitle()
    }
  },
  beforeMount: function () {
    const vue = this

    vue.setBodyClasses('page')
    vue.setPageTitle(vue.eventTitle + ' - Oops!')
  }
}
</script>
