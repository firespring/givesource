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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content">

                <div class="o-app-main-content">
                    <donations-metrics v-on:hasError="hasError"></donations-metrics>
                    <api-error v-model="apiError"></api-error>
                    <donations-list-table-header v-on:hasError="hasError"></donations-list-table-header>
                    <donations-list-table :donations="pagination.items" :loaded="pagination.loaded"></donations-list-table>
                    <paginated-table-footer :pagination="pagination" v-if="pagination.loaded"></paginated-table-footer>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import * as Utils from './../../../helpers/utils';
	import ComponentDonationsListTable from './DonationsListTable.vue';
	import ComponentDonationsListTableHeader from './DonationsListTableHeader.vue';
	import ComponentDonationsMetrics from './DonationsMetrics.vue';
	import ComponentPaginatedTableFooter from './../../pagination/PaginatedTableFooter.vue';
	import PaginationMixin from './../../../mixins/pagination';

	export default {
		data: function () {
			return {
				apiError: {}
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('donations', to.query).then(function (response) {
					vue.setPaginationData(response.data)
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.resetPaginationData();
			vue.$request.get('donations', to.query).then(function (response) {
				vue.setPaginationData(response.data);
				next();
			}).catch(function (err) {
				vue.apiError = err.response.data.errors;
				next();
			});
		},
		methods: {
			hasError: function (err) {
				const vue = this;
				vue.apiError = err.response.data.errors;
			}
		},
		mixins: [
			PaginationMixin
		],
		components: {
			'donations-list-table': ComponentDonationsListTable,
			'donations-list-table-header': ComponentDonationsListTableHeader,
			'donations-metrics': ComponentDonationsMetrics,
			'paginated-table-footer': ComponentPaginatedTableFooter,
		}
	};
</script>