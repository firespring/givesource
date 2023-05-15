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
  <div class="leaderboard-item leaderboard-item--detailed">
    <router-link
      :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }"
      class="leaderboard-item__image leaderboard-item__image--full"
      :style="'background-image: url(' + logoUrl + ')'"
    />

    <div class="leaderboard-item__info">
      <h3>
        <a
          :href="'/nonprofits/' + nonprofit.slug"
          @click="goToNonprofitLandingPage($event, nonprofit)"
        >
          {{ nonprofit.legalName }}
        </a>
      </h3>
      <p v-if="nonprofit.shortDescription">
        {{ nonprofit.shortDescription }}
      </p>
    </div>

    <div
      v-if="displayDonationAmount"
      class="leaderboard-item__amount"
    >
      {{ amount }}
    </div>

    <div
      v-if="canDonate"
      class="leaderboard-item__action"
    >
      <a
        href="#"
        class="btn btn--accent btn--sm"
        @click.prevent="donate"
      >Donate</a>
    </div>
  </div>
</template>

<script>
import * as Settings from './../../helpers/settings'

export default {
  props: {
    nonprofit: { type: Object, default: () => ({}) }
  },
  computed: {
    amount: function () {
      return this.formatMoney(this.nonprofit.donationsSubtotal)
    },
    displayDonationAmount: function () {
      return Settings.isDuringEvent() || Settings.isAfterEvent()
    },
    canDonate: function () {
      return Settings.isDuringDonations() || Settings.isDuringEvent()
    },
    logoUrl: function () {
      const vue = this
      let logo = false
      if (vue.nonprofit.logo) {
        logo = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.nonprofit.logo.path
      } else if (vue.$store.getters.setting('EVENT_LOGO')) {
        logo = vue.$store.getters.setting('EVENT_LOGO')
      } else {
        logo = require('/src/public-pages/assets/img/logo-event.png')
        // logo = '/assets/img/logo-event.png'
      }
      return logo
    }
  },
  methods: {
    donate: function () {
      const vue = this

      vue.addModal('donation-tiers', {
        nonprofit: vue.nonprofit
      })
    },
    goToNonprofitLandingPage: function (event, nonprofit) {
      const vue = this
      event.preventDefault()
      $('body').addClass('has-loader')
      vue.addModal('spinner')
      vue.$router.push({
        name: 'nonprofit-landing-page',
        params: { slug: nonprofit.slug }
      })
    }
  }
}
</script>
