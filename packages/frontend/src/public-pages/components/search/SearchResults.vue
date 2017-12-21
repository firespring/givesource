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
            <h1 slot="title">Nonprofit Search Results</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <search-results-header></search-results-header>

                <div class="leaderboard">
                    <search-results-row v-for="nonprofit in pagination.items" :nonprofit="nonprofit" :key="nonprofit.uuid"></search-results-row>
                </div>

                <pagination :pagination="pagination" v-if="pagination.loaded"></pagination>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	import * as Utils from './../../helpers/utils';

	const PaginationMixin = require('./../../mixins/pagination');

	module.exports = {
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Give To Our City - Search');
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				if (to.query.hasOwnProperty('search') && to.query.search) {
					axios.get(API_URL + 'nonprofits/search' + Utils.generateQueryString({
						keys: 'legalNameSearch',
						search: to.query.search.toLowerCase(),
						filter_key: 'status',
						filter: 'ACTIVE',
					})).then(function (response) {
						vue.setPaginationData({
							items: response.data,
						});
					});
				} else {
					const options = _.extend({}, {size: '10', sort: 'active_legal_name_ascending'}, to.query);
					axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
						vue.setPaginationData(response.data);
					});
				}
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			if (to.query.hasOwnProperty('search') && to.query.search) {
				axios.get(API_URL + 'nonprofits/search' + Utils.generateQueryString({
					keys: 'legalNameSearch',
					search: to.query.search.toLowerCase(),
					filter_key: 'status',
					filter: 'ACTIVE',
				})).then(function (response) {
					vue.setPaginationData({
						items: response.data,
					});
					next();
				});
			} else {
				const options = _.extend({}, {size: '10', sort: 'active_legal_name_ascending'}, to.query);
				axios.get(API_URL + 'nonprofits' + Utils.generateQueryString(options)).then(function (response) {
					vue.setPaginationData(response.data);
					next();
				});
			}
		},
		mixins: [
			PaginationMixin
		],
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
			'pagination': require('./../pagination/Pagination.vue'),
			'search-results-header': require('./SearchResultsHeader.vue'),
			'search-results-row': require('./SearchResultsRow.vue')
		}
	};
</script>