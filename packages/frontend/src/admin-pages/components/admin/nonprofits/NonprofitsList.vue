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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content">
                <div class="o-app-main-content">
                    <nonprofits-list-table-header></nonprofits-list-table-header>
                    <nonprofits-list-table :nonprofits="pagination.items" :loaded="pagination.loaded" v-on:updateNonprofit="updateNonprofit"></nonprofits-list-table>
                    <paginated-table-footer :pagination="pagination" v-if="pagination.loaded"></paginated-table-footer>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import * as Utils from './../../../helpers/utils';
	const PaginationMixin = require('./../../../mixins/pagination');

	module.exports = {
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('nonprofits', to.query).then(function (response) {
					vue.setPaginationData(response.data);
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.resetPaginationData();
			vue.$request.get('nonprofits', to.query).then(function (response) {
				vue.setPaginationData(response.data);
				next();
			}).catch(function (err) {
				console.log(err);
				next();
			});
		},
		mixins: [
			PaginationMixin
		],
        methods: {
			updateNonprofit: function (nonprofitUuid) {
				const vue = this;

				vue.$request.get('nonprofits/' + nonprofitUuid).then(function (response) {
					vue.pagination.items = _.map(vue.pagination.items, function (nonprofit) {
						return nonprofit.uuid === response.data.uuid ? response.data : nonprofit;
					});
				});
            }
        },
		components: {
			'nonprofits-list-table': require('./NonprofitsListTable.vue'),
			'nonprofits-list-table-header': require('./NonprofitsListTableHeader.vue'),
			'paginated-table-footer': require('./../../pagination/PaginatedTableFooter.vue')
		}
	};
</script>