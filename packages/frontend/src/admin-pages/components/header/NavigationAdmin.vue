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
  <nav class="o-menubar__secondary">
    <ul>
      <li>
        <router-link
          :to="{ name: 'donations-list' }"
        >
          <a><i
            class="fa fa-fw fa-credit-card"
            aria-hidden="true"
          />Donations</a>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'nonprofits-list' }"
        >
          <a><i
            class="fa fa-fw fa-bank"
            aria-hidden="true"
          />Nonprofits</a>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'sponsor-tiers-list' }"
        >
          <a><i
            class="fa fa-fw fa-star"
            aria-hidden="true"
          />Sponsors</a>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'pages-list' }"
        >
          <a><i
            class="fa fa-fw fa-files-o"
            aria-hidden="true"
          />Pages</a>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'settings-list' }"
        >
          <a><i
            class="fa fa-fw fa-cogs"
            aria-hidden="true"
          />Settings</a>
        </router-link>
      </li>
    </ul>

    <label
      for="admin-nav-menu"
      class="u-hidden-visually"
    >Admin Navigation Menu</label>
    <select
      id="admin-nav-menu"
      v-model="selected"
      @change="mobileSelect"
    >
      <option
        disabled
        value=""
      >
        Navigation
      </option>
      <option value="donations-list">
        Donations
      </option>
      <option value="nonprofits-list">
        Nonprofits
      </option>
      <option value="sponsor-tiers-list">
        Sponsors
      </option>
      <option value="pages-list">
        Pages
      </option>
      <option value="settings-list">
        Settings
      </option>
    </select>
  </nav>
</template>

<script>
export default {
  data: function () {
    return {
      selected: ''
    }
  },
  created: function () {
    this.setSelected()
  },
  methods: {
    setSelected: function () {
      const vue = this

      if (vue.$route.path.indexOf('/donations') === 0) {
        vue.selected = 'donations-list'
      } else if (vue.$route.path.indexOf('/nonprofits') === 0) {
        vue.selected = 'nonprofits-list'
      } else if (vue.$route.path.indexOf('/sponsor-tiers') === 0) {
        vue.selected = 'sponsor-tiers-list'
      } else if (vue.$route.path.indexOf('/pages') === 0) {
        vue.selected = 'pages-list'
      } else if (vue.$route.path.indexOf('/settings') === 0) {
        vue.selected = 'settings-list'
      }
    },
    mobileSelect: function () {
      const vue = this
      vue.$router.push({ name: vue.selected })
    }
  }
}
</script>
