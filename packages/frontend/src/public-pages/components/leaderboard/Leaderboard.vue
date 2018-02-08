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
    <div>
        <layout-hero :presentedBy="true">
            <h1 slot="title">Leaderboard</h1>
        </layout-hero>
        <main class="main">
            <div class="wrapper wrapper--sm">
                <div class="main__content">

                    <div class="leaderboard">
                        <div class="leaderboard-item" v-for="(nonprofit, nonprofitIndex) in pagination.items">
                            <div class="leaderboard-item__num">{{ position(nonprofitIndex) }}.</div>
                            <div class="leaderboard-item__info">
                                <h3>
                                    <router-link :to="{ name: 'nonprofit-landing-page', params: {slug: nonprofit.slug} }">{{ nonprofit.legalName }}</router-link>
                                </h3>
                            </div>
                            <div class="leaderboard-item__amount">{{ formatMoney(nonprofit.donationsSubtotal) }}</div>
                            <div v-if="canDonate" class="leaderboard-item__action"><a v-on:click.prevent="donate(nonprofit)" href="#" class="btn btn--accent btn--xs">Donate</a></div>
                        </div>
                    </div>

                    <pagination :pagination="pagination" v-if="pagination.loaded"></pagination>

                </div>
            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	const numeral = require('numeral');
	const PaginationMixin = require('./../../mixins/pagination');
	import * as Settings from './../../helpers/settings';
	import * as Utils from './../../helpers/utils';

	module.exports = {
		computed: {
			eventTitle: function () {
				return Settings.eventTitle();
			},
			canDonate: function () {
				return Settings.acceptDonations();
			}
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle(vue.eventTitle + ' - Leaderboard');
		},
		beforeRouteEnter: function (to, from, next) {
			const options = _.extend({}, {size: '20', sort: 'active_subtotal_descending'}, to.query);
			next(function (vue) {
				axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
					vue.setPaginationData(response.data);
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;
			const options = _.extend({}, {size: '20', sort: 'active_subtotal_descending'}, to.query);
			axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
				vue.setPaginationData(response.data);
				next();
			}).catch(function () {
				next();
			});
		},
		methods: {
			position: function (nonprofitIndex) {
				const position = parseInt(this.pagination.start) + nonprofitIndex + 1;
				return numeral(position).format('00');
			},
			donate: function (nonprofit) {
				const vue = this;

				vue.addModal('donation-tiers', {
					nonprofit: nonprofit
				});
			}
		},
		mixins: [
			PaginationMixin,
		],
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('./../layout/Hero.vue'),
			'layout-sponsors': require('./../layout/Sponsors.vue'),
			'pagination': require('./../pagination/Pagination.vue'),
		}
	};
</script>