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
    <div>
        <layout-header></layout-header>

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
                            <div v-if="canDonate" class="leaderboard-item__action"><a v-on:click.prevent="donate(nonprofit)" href="#" class="btn btn--accent btn--xs">Donate</a>
                            </div>
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
	import * as Settings from './../../helpers/settings';
	import * as Utils from './../../helpers/utils';
	import ComponentFooter from './../layout/Footer.vue';
	import ComponentHeader from './../layout/Header.vue';
	import ComponentHero from './../layout/Hero.vue';
	import ComponentPagination from './../pagination/Pagination.vue';
	import ComponentSponsors from './../layout/Sponsors.vue';
	import PaginationMixin from './../../mixins/pagination';

	const numeral = require('numeral');

	export default {
		computed: {
			eventTitle: function () {
				return Settings.eventTitle();
			},
			canDonate: function () {
				return Settings.isDuringDonations() || Settings.isDuringEvent();
			}
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle(vue.eventTitle + ' - Leaderboard');
		},
		beforeRouteEnter: function (to, from, next) {
			const options = _.extend({}, {size: '20', sort: 'active_subtotal_descending', includeMatchFund: 0}, to.query);
			next(function (vue) {
				axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
					vue.setPaginationData(response.data);
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			// Reset pagination
			vue.resetPaginationData();

			const options = _.extend({}, {size: '20', sort: 'active_subtotal_descending', includeMatchFund: 0}, to.query);
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
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
			'pagination': ComponentPagination,
		}
	};
</script>