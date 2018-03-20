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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content">
                <api-error v-model="apiError"></api-error>
                <div class="o-app-main-content">
                    <nonprofits-list-table-header :pagination="pagination" v-on:searchNonprofits="searchNonprofits" v-on:resetPagination="resetPagination">
                    </nonprofits-list-table-header>
                    <nonprofits-list-table :nonprofits="pagination.items" :loaded="pagination.loaded" v-on:updateNonprofit="updateNonprofit" v-on:hasError="hasError"></nonprofits-list-table>
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
	    data:function(){
	        return {
                apiError: {}
            };
        },
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
			});
		},
		created: function () {
			const vue = this;

			vue.bus.$on('revokeNonprofit', function (nonprofitUuid) {
				vue.updateNonprofit(nonprofitUuid);
			});

		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('revokeNonprofit');
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
				}).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                });
            },
            searchNonprofits: function (params) {
				const vue = this;

				let sort = 'all_created_on_descending';
				if (params.sort) {
					sort = params.sort;
					delete params.sort;
                }

				vue.pagination.loaded = false;
				vue.$request.get('nonprofits/search', params).then(function (response) {
					response.data.sort(function (a, b) {
						return Utils.sortAlphabetically(a, b, 'legalName');
					});
					vue.setPaginationData({
                        size: 0,
                        sort: sort,
                        start: 0,
                        total: 0,
                        items: response.data
                    });
                }).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                });
            },
            resetPagination: function () {
				const vue = this;

	            vue.resetPaginationData();
	            vue.$request.get('nonprofits', vue.$route.query).then(function (response) {
		            vue.setPaginationData(response.data);
	            }).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                });
            },
            hasError: function (err) {
                const vue = this;
                vue.apiError = err.response.data.errors;
            }
        },
		components: {
			'nonprofits-list-table': require('./NonprofitsListTable.vue'),
			'nonprofits-list-table-header': require('./NonprofitsListTableHeader.vue'),
			'paginated-table-footer': require('./../../pagination/PaginatedTableFooter.vue')
		}
	};
</script>