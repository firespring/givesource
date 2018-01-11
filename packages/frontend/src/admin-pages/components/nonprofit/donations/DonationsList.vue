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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content">
                <div class="o-app-main-content">

                    <div class="o-page-header" v-if="isAdmin">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title" v-if="nonprofit.legalName">Donations for {{ nonprofit.legalName }}</h1>
                        </div>
                    </div>

                    <donations-list-table-header :nonprofit="nonprofit"></donations-list-table-header>
                    <donations-list-table :donations="pagination.items"></donations-list-table>
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
		data: function () {
			return {
				nonprofit: {},
			};
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vue.nonprofit = response.data;
					return vue.$request.get('/nonprofits/' + to.params.nonprofitUuid + '/donations', to.query);
				}).then(function (response) {
					vue.setPaginationData(response.data);
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.resetPaginationData();
			vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
				return vue.$request.get('/nonprofits/' + to.params.nonprofitUuid + '/donations', to.query);
			}).then(function (response) {
				vue.setPaginationData(response.data);
				next();
			}).catch(function () {
				next();
			});
		},
		mixins: [
			PaginationMixin
		],
		components: {
			'donations-list-table': require('./DonationsListTable.vue'),
			'donations-list-table-header': require('./DonationsListTableHeader.vue'),
			'paginated-table-footer': require('./../../pagination/PaginatedTableFooter.vue')
		}
	};
</script>