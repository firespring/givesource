<!--
  ~ Copyright 2018 Firespring, Inc.
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

        <router-link :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }" class="leaderboard-item__image" :style="'background-image: url(' + logoUrl + ')'">
        </router-link>

        <div class="leaderboard-item__info">
            <h3>
                <router-link :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }">{{ nonprofit.legalName }}</router-link>
            </h3>
            <p v-if="nonprofit.shortDescription">
                {{ nonprofit.shortDescription }}
            </p>
        </div>

        <div v-if="displayDonationAmount" class="leaderboard-item__amount">{{ amount }}</div>

        <div v-if="canDonate" class="leaderboard-item__action">
            <a v-on:click.prevent="donate" href="#" class="btn btn--accent btn--sm">Donate</a>
        </div>
    </div>
</template>

<script>
	import * as Settings from './../../helpers/settings';

	export default {
		computed: {
			amount: function () {
				return this.formatMoney(this.nonprofit.donationsSubtotal);
			},
			displayDonationAmount: function () {
				return Settings.isDuringEvent() || Settings.isAfterEvent();
			},
			canDonate: function () {
				return Settings.isDuringDonations() || Settings.isDuringEvent();
			},
			logoUrl: function () {
				const vue = this;
				let logo = false;
				if (vue.nonprofit.logo) {
					logo = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.nonprofit.logo.path;
				} else if (vue.$store.getters.setting('EVENT_LOGO')) {
					logo = vue.$store.getters.setting('EVENT_LOGO');
				} else {
					logo = '/assets/temp/logo-event.png';
				}
				return logo;
			}
		},
		props: [
			'nonprofit'
		],
		methods: {
			donate: function () {
				const vue = this;

				vue.addModal('donation-tiers', {
					nonprofit: vue.nonprofit
				});
			}
		}
	};
</script>