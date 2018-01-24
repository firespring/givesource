<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <div class="leaderboard-item leaderboard-item--detailed">

        <div class="leaderboard-item__image">
            <router-link :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }"><img alt="" src="/assets/temp/thumbnail.jpg"></router-link>
        </div>

        <div class="leaderboard-item__info">
            <h3>
                <router-link :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }">{{ nonprofit.legalName }}</router-link>
            </h3>
            <p>
                {{ nonprofit.shortDescription }}
            </p>
        </div>

        <div v-if="displayDonationAmount" class="leaderboard-item__amount">{{ amount }}</div>

        <div class="leaderboard-item__action">
            <a v-on:click.prevent="donate" href="#" class="btn btn--sm btn--green">Donate</a>
        </div>
    </div>
</template>

<script>
	import * as Settings from './../../helpers/settings';

	module.exports = {
		computed: {
			amount: function () {
				return this.formatMoney(this.nonprofit.donationsSubtotal);
			},
			displayDonationAmount: function () {
				return Settings.isDayOfEventOrAfter();
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