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
    <footer class="page-footer">
      <slot />

      <div class="contact-info">
        <div class="contact-info__item contact-info__copyright">
          &copy; {{ year }} <router-link :to="{ name: 'homepage' }">
            {{ eventTitle }}
          </router-link>
        </div>

        <div class="contact-info__item contact-info__contact">
          <router-link :to="{ name: 'contact' }">
            <i
              class="fas fa-envelope"
              aria-hidden="true"
            /><span>Contact Us</span>
          </router-link>
        </div>

        <div
          v-if="contactPhone"
          class="contact-info__item contact-info__contact"
        >
          <i
            class="fas fa-phone"
            aria-hidden="true"
          /><span>{{ contactPhone }}</span>
        </div>

        <div
          v-if="displayTerms"
          class="contact-info__item contact-info__terms"
        >
          <router-link :to="{ name: 'terms' }">
            Terms of Service
          </router-link>
        </div>

        <div class="contact-info__item contact-info__login">
          <a :href="adminPagesUrl"><i
            class="fas fa-sign-in-alt"
            aria-hidden="true"
          /><span>Admin Log In</span></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import * as Settings from './../../helpers/settings'
import { useAppStore } from "../../store"
export default {
  beforeCreate () {
    this.$store = useAppStore()
  },
  computed: {
    adminPagesUrl: function () {
      return this.$store.setting('ADMIN_URL') + '/login'
    },
    contactPhone: function () {
      return this.$store.setting('CONTACT_PHONE') || null
    },
    displayTerms: function () {
      return this.$store.booleanSetting('PAGE_TERMS_ENABLED')
    },
    year: function () {
      return new Date().getFullYear()
    },
    eventTitle: function () {
      return Settings.eventTitle()
    }
  }
}
</script>
